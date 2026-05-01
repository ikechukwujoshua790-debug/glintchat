import { Principal } from "@icp-sdk/core/principal";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mic,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MediaType } from "../backend";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { MediaMessage } from "../components/MediaMessage";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateCallRoom,
  useDirectMessages,
  useRequestMediaUploadUrl,
  useSendDirectMessage,
  useUserProfile,
} from "../hooks/useBackend";
import { CallType } from "../types";
import type { UserId } from "../types";

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

export function ChatDetailPage() {
  const { userId } = useParams({ strict: false }) as { userId: string };
  const { identity } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  let recipientId: UserId | null = null;
  try {
    recipientId = Principal.fromText(userId);
  } catch {
    recipientId = null;
  }

  const { data: recipientProfile, isLoading: profileLoading } =
    useUserProfile(recipientId);
  const { data: messages, isLoading: msgsLoading } =
    useDirectMessages(recipientId);
  const sendMessage = useSendDirectMessage();
  const requestUploadUrl = useRequestMediaUploadUrl();
  const createCallRoom = useCreateCallRoom();

  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleSend = async () => {
    if (!message.trim() || !recipientId) return;
    const msg = message.trim();
    setMessage("");
    await sendMessage.mutateAsync({
      recipientId,
      content: msg,
      mediaType: MediaType.none,
    });
    inputRef.current?.focus();
  };

  // Upload a file blob and send as media message
  const uploadAndSend = useCallback(
    async (blob: Blob, mediaType: MediaType, content = "") => {
      if (!recipientId) return;
      try {
        const buffer = await blob.arrayBuffer();
        const hash = await computeHash(buffer);
        const cert = await requestUploadUrl.mutateAsync(hash);
        // Upload using the gateway URL
        await fetch(cert.blobHash, {
          method: cert.method,
          body: blob,
          headers: { "Content-Type": blob.type || "application/octet-stream" },
        });
        await sendMessage.mutateAsync({
          recipientId,
          content,
          mediaUrl: hash,
          mediaType,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        toast.error("Media upload failed", { description: msg });
      }
    },
    [recipientId, requestUploadUrl, sendMessage],
  );

  // Paperclip file select handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const mediaType = file.type.startsWith("video/")
      ? MediaType.video
      : MediaType.image;
    await uploadAndSend(file, mediaType);
  };

  // Voice recording
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
    if (audioBlob.size < 500) return; // too short
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

  // Call handlers
  const handleCall = async (callType: CallType) => {
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
          ? "A Daily.co API key is required to enable calls. Configure it in the Admin panel."
          : errMsg,
      });
    }
  };

  const displayName = recipientProfile?.realName ?? `${userId.slice(0, 12)}…`;
  const isVerified = recipientProfile?.isVerified ?? false;

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
              data-ocid="chat.back_button"
              onClick={() => navigate({ to: "/chats" })}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth md:hidden shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            {profileLoading ? (
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                    {initials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {displayName}
                    </p>
                    {isVerified && (
                      <CheckCircle2
                        size={14}
                        className="text-blue-400 shrink-0"
                        aria-label="Verified"
                      />
                    )}
                  </div>
                  <p className="text-xs text-primary font-medium">● Online</p>
                </div>
              </div>
            )}

            {/* Call buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                data-ocid="chat.voice_call_button"
                onClick={() => handleCall(CallType.voice)}
                disabled={createCallRoom.isPending}
                className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50"
                aria-label="Voice call"
              >
                {createCallRoom.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Phone size={17} />
                )}
              </button>
              <button
                type="button"
                data-ocid="chat.video_call_button"
                onClick={() => handleCall(CallType.video)}
                disabled={createCallRoom.isPending}
                className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50"
                aria-label="Video call"
              >
                <Video size={17} />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-background">
            {msgsLoading ? (
              <div className="space-y-3 pt-2">
                {["left-lg", "right", "left-sm", "right-md", "left"].map(
                  (key) => {
                    const isRight = key.startsWith("right");
                    return (
                      <div
                        key={key}
                        className={`flex ${isRight ? "justify-end" : "justify-start"}`}
                      >
                        <Skeleton
                          className={`h-10 rounded-2xl ${isRight ? "w-44" : "w-52"}`}
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
                        const isMine = msg.senderId.toString() === myPrincipal;
                        const hasMedia =
                          msg.mediaType !== MediaType.none && msg.mediaUrl;
                        return (
                          <div
                            key={msg.id.toString()}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            data-ocid={`chat.message.${idx + 1}`}
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
                                className={`text-[10px] mt-1 text-right ${isMine ? "text-primary-foreground/65" : "text-muted-foreground"}`}
                              >
                                {formatTime(msg.timestamp)}
                                {isMine && (
                                  <span className="ml-1 opacity-80">✓✓</span>
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
                data-ocid="chat.empty_state"
                className="flex flex-col items-center justify-center h-full gap-4 pt-12"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {initials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground flex items-center gap-1.5 justify-center">
                    {displayName}
                    {isVerified && (
                      <CheckCircle2 size={14} className="text-blue-400" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Say hello to start the conversation
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div
            className="bg-card px-3 py-2.5 flex items-center gap-2 shrink-0"
            style={{ borderTop: "1px solid oklch(var(--border) / 0.5)" }}
          >
            {isRecording ? (
              /* Recording state */
              <div className="flex-1 flex items-center gap-3 px-2">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="w-8 h-8 rounded-full bg-destructive/15 hover:bg-destructive/25 text-destructive flex items-center justify-center transition-smooth shrink-0"
                  aria-label="Cancel recording"
                  data-ocid="chat.cancel_recording_button"
                >
                  <X size={14} />
                </button>
                <div className="flex-1 flex items-center gap-2">
                  {/* Animated waveform */}
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
                  data-ocid="chat.send_voice_button"
                >
                  <Send size={15} />
                </button>
              </div>
            ) : (
              /* Normal input state */
              <>
                {/* Hidden file input */}
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
                  data-ocid="chat.attach_button"
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
                    data-ocid="chat.message_input"
                    placeholder={`Write a message to ${recipientProfile?.realName ?? "user"}…`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend()
                    }
                    className="w-full bg-secondary rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 border-transparent"
                    style={{ border: "1px solid oklch(var(--border) / 0.3)" }}
                  />
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0"
                  aria-label="Emoji"
                  data-ocid="chat.emoji_button"
                >
                  <Smile size={16} />
                </button>
                {message.trim() ? (
                  <Button
                    data-ocid="chat.send_button"
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
                    data-ocid="chat.mic_button"
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
              data-ocid="chat.lightbox_close_button"
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
