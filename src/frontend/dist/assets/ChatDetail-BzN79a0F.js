import { b as useParams, u as useNavigate, r as reactExports, P as Principal, j as jsxRuntimeExports } from "./index-DFLYPydE.js";
import { u as ue, P as Phone } from "./index-CdinL_su.js";
import { e as useUserProfile, f as useDirectMessages, g as useSendDirectMessage, h as useRequestMediaUploadUrl, i as useCreateCallRoom, M as MediaType, L as Layout, C as CallType } from "./Layout-81mP_Nwv.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { V as Video, M as MediaMessage, P as Paperclip, a as Mic } from "./MediaMessage-CzH0IhCZ.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-DkW0CPeH.js";
import { c as createLucideIcon, B as Button } from "./button-CQxG3T_J.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
import { A as ArrowLeft } from "./arrow-left-BN3M1AU1.js";
import { C as CircleCheck } from "./circle-check-CNxC-s1K.js";
import { L as LoaderCircle } from "./loader-circle-EI3rWnIU.js";
import { X } from "./x-Cj4_CEQM.js";
import { S as Send } from "./send-DuQhnxeL.js";
import "./index-B-snK1QX.js";
import "./index-15HxH_qF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Smile = createLucideIcon("smile", __iconNode);
function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatTime(ts) {
  return new Date(Number(ts / BigInt(1e6))).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatDateLabel(ts) {
  const d = new Date(Number(ts / BigInt(1e6)));
  const today = /* @__PURE__ */ new Date();
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}
async function computeHash(buffer) {
  const hashBuf = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function ChatDetailPage() {
  const { userId } = useParams({ strict: false });
  const { identity } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const [isRecording, setIsRecording] = reactExports.useState(false);
  const [recordingSeconds, setRecordingSeconds] = reactExports.useState(0);
  const mediaRecorderRef = reactExports.useRef(null);
  const audioChunksRef = reactExports.useRef([]);
  const recordingTimerRef = reactExports.useRef(null);
  const [lightboxUrl, setLightboxUrl] = reactExports.useState(null);
  let recipientId = null;
  try {
    recipientId = Principal.fromText(userId);
  } catch {
    recipientId = null;
  }
  const { data: recipientProfile, isLoading: profileLoading } = useUserProfile(recipientId);
  const { data: messages, isLoading: msgsLoading } = useDirectMessages(recipientId);
  const sendMessage = useSendDirectMessage();
  const requestUploadUrl = useRequestMediaUploadUrl();
  const createCallRoom = useCreateCallRoom();
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  reactExports.useEffect(() => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  });
  const handleSend = async () => {
    var _a;
    if (!message.trim() || !recipientId) return;
    const msg = message.trim();
    setMessage("");
    await sendMessage.mutateAsync({
      recipientId,
      content: msg,
      mediaType: MediaType.none
    });
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const uploadAndSend = reactExports.useCallback(
    async (blob, mediaType, content = "") => {
      if (!recipientId) return;
      try {
        const buffer = await blob.arrayBuffer();
        const hash = await computeHash(buffer);
        const cert = await requestUploadUrl.mutateAsync(hash);
        await fetch(cert.blobHash, {
          method: cert.method,
          body: blob,
          headers: { "Content-Type": blob.type || "application/octet-stream" }
        });
        await sendMessage.mutateAsync({
          recipientId,
          content,
          mediaUrl: hash,
          mediaType
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        ue.error("Media upload failed", { description: msg });
      }
    },
    [recipientId, requestUploadUrl, sendMessage]
  );
  const handleFileChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    e.target.value = "";
    const mediaType = file.type.startsWith("video/") ? MediaType.video : MediaType.image;
    await uploadAndSend(file, mediaType);
  };
  const startRecording = reactExports.useCallback(async () => {
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
        1e3
      );
    } catch {
      ue.error("Microphone access denied", {
        description: "Please allow microphone access to send voice messages."
      });
    }
  }, []);
  const stopRecording = reactExports.useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    await new Promise((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
      for (const track of recorder.stream.getTracks()) track.stop();
    });
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];
    if (audioBlob.size < 500) return;
    await uploadAndSend(audioBlob, MediaType.audio);
  }, [uploadAndSend]);
  const cancelRecording = reactExports.useCallback(() => {
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
  const handleCall = async (callType) => {
    if (!recipientId) return;
    try {
      const room = await createCallRoom.mutateAsync({ recipientId, callType });
      window.open(room.roomUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Could not create call room";
      const isConfig = errMsg.toLowerCase().includes("api key") || errMsg.toLowerCase().includes("not configured");
      ue.error(isConfig ? "Calls not configured" : "Call failed", {
        description: isConfig ? "A Daily.co API key is required to enable calls. Configure it in the Admin panel." : errMsg
      });
    }
  };
  const displayName = (recipientProfile == null ? void 0 : recipientProfile.realName) ?? `${userId.slice(0, 12)}…`;
  const isVerified = (recipientProfile == null ? void 0 : recipientProfile.isVerified) ?? false;
  const msgsByDate = [];
  if (messages && messages.length > 0) {
    let currentLabel = "";
    for (const msg of messages) {
      const label = formatDateLabel(msg.timestamp);
      if (label !== currentLabel) {
        currentLabel = label;
        msgsByDate.push({ label, msgs: [] });
      }
      msgsByDate[msgsByDate.length - 1].msgs.push(msg);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card px-4 py-3 flex items-center gap-3 elevation-sm shrink-0",
          style: { borderBottom: "1px solid oklch(var(--border) / 0.5)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "chat.back_button",
                onClick: () => navigate({ to: "/chats" }),
                className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth md:hidden shrink-0",
                "aria-label": "Back",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
              }
            ),
            profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-9 h-9 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary text-sm font-bold", children: initials(displayName) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: displayName }),
                  isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleCheck,
                    {
                      size: 14,
                      className: "text-blue-400 shrink-0",
                      "aria-label": "Verified"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: "● Online" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "chat.voice_call_button",
                  onClick: () => handleCall(CallType.voice),
                  disabled: createCallRoom.isPending,
                  className: "w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50",
                  "aria-label": "Voice call",
                  children: createCallRoom.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 17 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "chat.video_call_button",
                  onClick: () => handleCall(CallType.video),
                  disabled: createCallRoom.isPending,
                  className: "w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50",
                  "aria-label": "Video call",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 17 })
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-1 bg-background", children: msgsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-2", children: ["left-lg", "right", "left-sm", "right-md", "left"].map(
        (key) => {
          const isRight = key.startsWith("right");
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex ${isRight ? "justify-end" : "justify-start"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: `h-10 rounded-2xl ${isRight ? "w-44" : "w-52"}`
                }
              )
            },
            key
          );
        }
      ) }) : messages && messages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        msgsByDate.map(({ label, msgs }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs text-muted-foreground bg-card px-3 py-1 rounded-full",
              style: {
                border: "1px solid oklch(var(--border) / 0.3)"
              },
              children: label
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: msgs.map((msg, idx) => {
            const isMine = msg.senderId.toString() === myPrincipal;
            const hasMedia = msg.mediaType !== MediaType.none && msg.mediaUrl;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex ${isMine ? "justify-end" : "justify-start"}`,
                "data-ocid": `chat.message.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `message-bubble max-w-[72%] ${isMine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-foreground rounded-bl-sm"}`,
                    style: !isMine ? {
                      border: "1px solid oklch(var(--border) / 0.4)"
                    } : void 0,
                    children: [
                      hasMedia && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MediaMessage,
                        {
                          mediaUrl: msg.mediaUrl,
                          mediaType: msg.mediaType,
                          isMine,
                          onImageClick: setLightboxUrl
                        }
                      ) }),
                      msg.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed break-words", children: msg.content }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: `text-[10px] mt-1 text-right ${isMine ? "text-primary-foreground/65" : "text-muted-foreground"}`,
                          children: [
                            formatTime(msg.timestamp),
                            isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 opacity-80", children: "✓✓" })
                          ]
                        }
                      )
                    ]
                  }
                )
              },
              msg.id.toString()
            );
          }) })
        ] }, label)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "chat.empty_state",
          className: "flex flex-col items-center justify-center h-full gap-4 pt-12",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary font-bold", children: initials(displayName) }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground flex items-center gap-1.5 justify-center", children: [
                displayName,
                isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-blue-400" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Say hello to start the conversation" })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card px-3 py-2.5 flex items-center gap-2 shrink-0",
          style: { borderTop: "1px solid oklch(var(--border) / 0.5)" },
          children: isRecording ? (
            /* Recording state */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 px-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: cancelRecording,
                  className: "w-8 h-8 rounded-full bg-destructive/15 hover:bg-destructive/25 text-destructive flex items-center justify-center transition-smooth shrink-0",
                  "aria-label": "Cancel recording",
                  "data-ocid": "chat.cancel_recording_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-[3px] h-6", children: [
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
                  "b15"
                ].map((id, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-[3px] rounded-full bg-destructive",
                    style: {
                      height: `${30 + (i * 37 + 11) % 70}%`,
                      animation: `pulse 0.${4 + i % 4}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.05}s`
                    }
                  },
                  id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-mono tabular-nums", children: `${Math.floor(recordingSeconds / 60)}:${(recordingSeconds % 60).toString().padStart(2, "0")}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onMouseUp: stopRecording,
                  onTouchEnd: stopRecording,
                  className: "w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transition-smooth shrink-0",
                  "aria-label": "Send voice message",
                  "data-ocid": "chat.send_voice_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 })
                }
              )
            ] })
          ) : (
            /* Normal input state */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: "image/*,video/*",
                  className: "hidden",
                  onChange: handleFileChange,
                  "aria-label": "Attach media"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0",
                  "aria-label": "Attach file",
                  "data-ocid": "chat.attach_button",
                  children: requestUploadUrl.isPending || sendMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  "data-ocid": "chat.message_input",
                  placeholder: `Write a message to ${(recipientProfile == null ? void 0 : recipientProfile.realName) ?? "user"}…`,
                  value: message,
                  onChange: (e) => setMessage(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && handleSend(),
                  className: "w-full bg-secondary rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 border-transparent",
                  style: { border: "1px solid oklch(var(--border) / 0.3)" }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0",
                  "aria-label": "Emoji",
                  "data-ocid": "chat.emoji_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { size: 16 })
                }
              ),
              message.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "chat.send_button",
                  size: "icon",
                  onClick: handleSend,
                  disabled: sendMessage.isPending,
                  className: "shrink-0 h-9 w-9 rounded-xl",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "chat.mic_button",
                  onMouseDown: startRecording,
                  onTouchStart: startRecording,
                  className: "w-9 h-9 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-smooth shrink-0",
                  "aria-label": "Hold to record voice message",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 16 })
                }
              )
            ] })
          )
        }
      )
    ] }),
    lightboxUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "dialog",
      {
        open: true,
        className: "fixed inset-0 z-50 m-0 w-full h-full max-w-none max-h-none bg-background/90 backdrop-blur-sm flex items-center justify-center border-none p-0",
        "aria-label": "Full-size media viewer",
        onClose: () => setLightboxUrl(null),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-secondary transition-smooth",
              onClick: () => setLightboxUrl(null),
              "aria-label": "Close viewer",
              "data-ocid": "chat.lightbox_close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute inset-0 w-full h-full cursor-default",
              onClick: () => setLightboxUrl(null),
              "aria-label": "Close viewer backdrop",
              tabIndex: -1
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: lightboxUrl,
              alt: "Full size media",
              className: "relative max-w-[90vw] max-h-[85vh] rounded-xl object-contain z-10"
            }
          )
        ]
      }
    )
  ] }) });
}
export {
  ChatDetailPage
};
