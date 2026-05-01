import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LogOut,
  Mic,
  Paperclip,
  Phone,
  Send,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MediaType } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { MediaMessage } from "../components/MediaMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateCallRoom,
  useGroup,
  useGroupMessages,
  useLeaveGroup,
  useRequestMediaUploadUrl,
  useSendGroupMessage,
  useUserProfile,
} from "../hooks/useBackend";
import { CallType } from "../types";
import type { GroupMember } from "../types";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(ts: bigint) {
  return new Date(Number(ts / BigInt(1_000_000))).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(ts: bigint) {
  const d = new Date(Number(ts / BigInt(1_000_000)));
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}

async function computeHash(buffer: ArrayBuffer): Promise<string> {
  const hashBuf = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function MemberRow({ member }: { member: GroupMember }) {
  const { data: profile } = useUserProfile(member.userId);
  const name = profile?.realName ?? `${member.userId.toString().slice(0, 8)}…`;
  return (
    <div className="flex items-center gap-2.5 py-2">
      <div className="relative shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full border border-card" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-foreground truncate">
            {name}
          </span>
          {profile?.isVerified && (
            <CheckCircle2 size={11} className="text-blue-400 shrink-0" />
          )}
          {member.isAdmin && (
            <span className="text-[9px] font-semibold text-accent bg-accent/10 px-1 rounded shrink-0">
              Admin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function GroupDetailPage() {
  const { groupId } = useParams({ strict: false }) as { groupId: string };

  let gid: bigint;
  try {
    gid = BigInt(groupId);
  } catch {
    return (
      <AuthGuard>
        <Layout>
          <div
            className="flex flex-col items-center justify-center h-full gap-4"
            data-ocid="group_detail.error_state"
          >
            <AlertCircle size={32} className="text-destructive" />
            <p className="font-semibold text-foreground">Group not found</p>
            <p className="text-sm text-muted-foreground">
              The group ID is invalid.
            </p>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return <GroupDetailContent gid={gid} />;
}

function GroupDetailContent({ gid }: { gid: bigint }) {
  const { identity } = useAuth();
  const { data: group, isLoading: groupLoading } = useGroup(gid);
  const { data: messages, isLoading: msgLoading } = useGroupMessages(gid);
  const sendMessage = useSendGroupMessage();
  const leaveGroup = useLeaveGroup();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const requestUploadUrl = useRequestMediaUploadUrl();
  const createCallRoom = useCreateCallRoom();
  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleSend = async () => {
    if (!content.trim()) return;
    const msg = content.trim();
    setContent("");
    await sendMessage.mutateAsync({
      groupId: gid,
      content: msg,
      mediaType: MediaType.none,
    });
    inputRef.current?.focus();
  };

  const handleLeave = async () => {
    await leaveGroup.mutateAsync(gid);
    toast.success("Left the group");
    navigate({ to: "/groups" });
  };

  // Upload and send media
  const uploadAndSend = useCallback(
    async (blob: Blob, mediaType: MediaType, msgContent = "") => {
      try {
        const buffer = await blob.arrayBuffer();
        const hash = await computeHash(buffer);
        const cert = await requestUploadUrl.mutateAsync(hash);
        await fetch(cert.blobHash, {
          method: cert.method,
          body: blob,
          headers: { "Content-Type": blob.type || "application/octet-stream" },
        });
        await sendMessage.mutateAsync({
          groupId: gid,
          content: msgContent,
          mediaUrl: hash,
          mediaType,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast.error("Media upload failed", { description: msg });
      }
    },
    [gid, requestUploadUrl, sendMessage],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const mediaType = file.type.startsWith("video/")
      ? MediaType.video
      : MediaType.image;
    await uploadAndSend(file, mediaType);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(
        () => setRecordingSeconds((s) => s + 1),
        1000,
      );
    } catch {
      toast.error("Microphone access denied", {
        description: "Please allow microphone access to send voice messages.",
      });
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
      for (const track of recorder.stream.getTracks()) track.stop();
    });

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];
    if (audioBlob.size < 500) return;
    await uploadAndSend(audioBlob, MediaType.audio);
  }, [uploadAndSend]);

  const cancelRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    recorder.stop();
    for (const track of recorder.stream.getTracks()) track.stop();
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setRecordingSeconds(0);
  }, []);

  const handleCall = async (callType: CallType) => {
    // For group calls, use the group creator or first member as placeholder recipient
    const recipientId = group?.creatorId;
    if (!recipientId) return;
    try {
      const room = await createCallRoom.mutateAsync({ recipientId, callType });
      window.open(room.roomUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Could not create call room";
      const isConfig =
        errMsg.toLowerCase().includes("api key") ||
        errMsg.toLowerCase().includes("not configured");
      toast.error(isConfig ? "Calls not configured" : "Call failed", {
        description: isConfig
          ? "A Daily.co API key is required. Configure it in the Admin panel."
          : errMsg,
      });
    }
  };

  // Group messages by date
  const msgsByDate: { label: string; msgs: typeof messages }[] = [];
  if (messages && messages.length > 0) {
    let currentLabel = "";
    for (const msg of messages) {
      const label = formatDateLabel(msg.timestamp);
      if (label !== currentLabel) {
        currentLabel = label;
        msgsByDate.push({ label, msgs: [] });
      }
      msgsByDate[msgsByDate.length - 1].msgs!.push(msg);
    }
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="bg-card px-4 py-3 flex items-center gap-3 elevation-sm shrink-0"
            style={{ borderBottom: "1px solid oklch(var(--border) / 0.5)" }}
          >
            <button
              type="button"
              data-ocid="group_detail.back_button"
              onClick={() => navigate({ to: "/groups" })}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0"
              aria-label="Back to groups"
            >
              <ArrowLeft size={18} />
            </button>

            {groupLoading ? (
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <Skeleton className="h-4 w-36" />
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                    {group ? initials(group.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {group?.name ?? "Group"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {group?.members.length ?? 0} member
                    {(group?.members.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Group call buttons */}
              <button
                type="button"
                data-ocid="group_detail.voice_call_button"
                onClick={() => handleCall(CallType.voice)}
                disabled={createCallRoom.isPending}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50"
                aria-label="Group voice call"
              >
                {createCallRoom.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Phone size={15} />
                )}
              </button>
              <button
                type="button"
                data-ocid="group_detail.video_call_button"
                onClick={() => handleCall(CallType.video)}
                disabled={createCallRoom.isPending}
                className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50"
                aria-label="Group video call"
              >
                <Video size={15} />
              </button>

              <button
                type="button"
                data-ocid="group_detail.members_button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-smooth ${
                  sidebarOpen
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-secondary text-muted-foreground"
                }`}
                aria-label="Toggle member list"
              >
                <Users size={16} />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    data-ocid="group_detail.leave_open_modal_button"
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-smooth"
                    aria-label="Leave group"
                  >
                    <LogOut size={15} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent data-ocid="group_detail.leave_dialog">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 font-display">
                      <AlertCircle size={18} className="text-destructive" />
                      Leave Group?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will no longer receive messages from{" "}
                      <strong>{group?.name}</strong>. You can rejoin if someone
                      adds you back.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-ocid="group_detail.leave_cancel_button">
                      Stay
                    </AlertDialogCancel>
                    <AlertDialogAction
                      data-ocid="group_detail.leave_confirm_button"
                      onClick={handleLeave}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      Leave Group
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Messages */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-background">
                {msgLoading ? (
                  <div
                    className="space-y-3 pt-2"
                    data-ocid="group_detail.loading_state"
                  >
                    {["left-a", "right-a", "left-b", "right-b", "left-c"].map(
                      (key) => {
                        const isRight = key.startsWith("right");
                        return (
                          <div
                            key={key}
                            className={`flex ${isRight ? "justify-end" : "justify-start"}`}
                          >
                            <Skeleton
                              className={`h-10 rounded-2xl ${isRight ? "w-44" : "w-56"}`}
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : messages && messages.length > 0 ? (
                  <>
                    {msgsByDate.map(({ label, msgs }) => (
                      <div key={label}>
                        <div className="flex justify-center my-4">
                          <span
                            className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full"
                            style={{
                              border: "1px solid oklch(var(--border) / 0.3)",
                            }}
                          >
                            {label}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {msgs!.map((msg, idx) => {
                            const isMine =
                              msg.senderId.toString() === myPrincipal;
                            const hasMedia =
                              msg.mediaType !== MediaType.none && msg.mediaUrl;
                            return (
                              <div
                                key={msg.id.toString()}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                data-ocid={`group_detail.message.${idx + 1}`}
                              >
                                <div
                                  className={`message-bubble max-w-[72%] ${
                                    isMine
                                      ? "bg-primary text-primary-foreground rounded-br-sm"
                                      : "bg-card text-foreground rounded-bl-sm"
                                  }`}
                                  style={
                                    !isMine
                                      ? {
                                          border:
                                            "1px solid oklch(var(--border) / 0.4)",
                                        }
                                      : undefined
                                  }
                                >
                                  {!isMine && (
                                    <p className="text-[10px] font-semibold text-primary mb-1">
                                      {msg.senderId.toString().slice(0, 8)}…
                                    </p>
                                  )}
                                  {hasMedia && (
                                    <div className="mb-1">
                                      <MediaMessage
                                        mediaUrl={msg.mediaUrl!}
                                        mediaType={msg.mediaType}
                                        isMine={isMine}
                                        onImageClick={setLightboxUrl}
                                      />
                                    </div>
                                  )}
                                  {msg.content && (
                                    <p className="text-sm leading-relaxed break-words">
                                      {msg.content}
                                    </p>
                                  )}
                                  <p
                                    className={`text-[10px] mt-1 text-right ${
                                      isMine
                                        ? "text-primary-foreground/65"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {formatTime(msg.timestamp)}
                                    {isMine && (
                                      <span className="ml-1 opacity-80">
                                        ✓✓
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div
                    data-ocid="group_detail.empty_state"
                    className="flex flex-col items-center justify-center h-full gap-4 pt-12"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {group ? initials(group.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm text-foreground">
                        {group?.name ?? "Group"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        No messages yet — say hello to the group!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div
                className="bg-card px-3 py-2.5 flex items-center gap-2 shrink-0"
                style={{ borderTop: "1px solid oklch(var(--border) / 0.5)" }}
              >
                {isRecording ? (
                  <div className="flex-1 flex items-center gap-3 px-2">
                    <button
                      type="button"
                      onClick={cancelRecording}
                      className="w-8 h-8 rounded-full bg-destructive/15 hover:bg-destructive/25 text-destructive flex items-center justify-center transition-smooth shrink-0"
                      aria-label="Cancel recording"
                      data-ocid="group_detail.cancel_recording_button"
                    >
                      <X size={14} />
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex items-center gap-[3px] h-6">
                        {[
                          "b0",
                          "b1",
                          "b2",
                          "b3",
                          "b4",
                          "b5",
                          "b6",
                          "b7",
                          "b8",
                          "b9",
                          "b10",
                          "b11",
                          "b12",
                          "b13",
                          "b14",
                          "b15",
                        ].map((id, i) => (
                          <div
                            key={id}
                            className="w-[3px] rounded-full bg-destructive"
                            style={{
                              height: `${30 + ((i * 37 + 11) % 70)}%`,
                              animation: `pulse 0.${4 + (i % 4)}s ease-in-out infinite alternate`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-destructive font-mono tabular-nums">
                        {`${Math.floor(recordingSeconds / 60)}:${(recordingSeconds % 60).toString().padStart(2, "0")}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onMouseUp={stopRecording}
                      onTouchEnd={stopRecording}
                      className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transition-smooth shrink-0"
                      aria-label="Send voice message"
                      data-ocid="group_detail.send_voice_button"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                      aria-label="Attach media"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0"
                      aria-label="Attach file"
                      data-ocid="group_detail.attach_button"
                    >
                      {requestUploadUrl.isPending || sendMessage.isPending ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Paperclip size={16} />
                      )}
                    </button>
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        data-ocid="group_detail.message_input"
                        placeholder={`Message ${group?.name ?? "group"}…`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !e.shiftKey && handleSend()
                        }
                        className="w-full bg-secondary rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        style={{
                          border: "1px solid oklch(var(--border) / 0.3)",
                        }}
                      />
                    </div>
                    {content.trim() ? (
                      <Button
                        data-ocid="group_detail.send_button"
                        size="icon"
                        onClick={handleSend}
                        disabled={sendMessage.isPending}
                        className="shrink-0 h-9 w-9 rounded-xl"
                      >
                        <Send size={15} />
                      </Button>
                    ) : (
                      <button
                        type="button"
                        data-ocid="group_detail.mic_button"
                        onMouseDown={startRecording}
                        onTouchStart={startRecording}
                        className="w-9 h-9 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-smooth shrink-0"
                        aria-label="Hold to record voice message"
                      >
                        <Mic size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Members sidebar */}
            {sidebarOpen && (
              <div
                className="w-56 bg-card flex-col overflow-y-auto shrink-0 hidden lg:flex"
                style={{ borderLeft: "1px solid oklch(var(--border) / 0.4)" }}
              >
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    borderBottom: "1px solid oklch(var(--border) / 0.3)",
                  }}
                >
                  <Users size={14} className="text-muted-foreground" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Members ({group?.members.length ?? 0})
                  </h3>
                </div>
                <div className="px-3 py-2">
                  {groupLoading ? (
                    <div className="space-y-2">
                      {["s1", "s2", "s3"].map((k) => (
                        <div key={k} className="flex items-center gap-2">
                          <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                          <Skeleton className="h-3 flex-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    group?.members.map((member) => (
                      <MemberRow
                        key={member.userId.toString()}
                        member={member}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxUrl && (
          <dialog
            open
            className="fixed inset-0 z-50 m-0 w-full h-full max-w-none max-h-none bg-background/90 backdrop-blur-sm flex items-center justify-center border-none p-0"
            aria-label="Full-size media viewer"
            onClose={() => setLightboxUrl(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-secondary transition-smooth"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close viewer"
              data-ocid="group_detail.lightbox_close_button"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={() => setLightboxUrl(null)}
              aria-label="Close viewer backdrop"
              tabIndex={-1}
            />
            <img
              src={lightboxUrl}
              alt="Full size media"
              className="relative max-w-[90vw] max-h-[85vh] rounded-xl object-contain z-10"
            />
          </dialog>
        )}
      </Layout>
    </AuthGuard>
  );
}
