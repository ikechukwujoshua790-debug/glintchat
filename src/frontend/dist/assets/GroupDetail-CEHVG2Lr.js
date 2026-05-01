import { j as jsxRuntimeExports, r as reactExports, b as useParams, u as useNavigate } from "./index-DFLYPydE.js";
import { u as ue, P as Phone } from "./index-CdinL_su.js";
import { L as Layout, k as useGroup, l as useGroupMessages, m as useSendGroupMessage, n as useLeaveGroup, h as useRequestMediaUploadUrl, i as useCreateCallRoom, M as MediaType, U as Users, e as useUserProfile, C as CallType } from "./Layout-81mP_Nwv.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { V as Video, M as MediaMessage, P as Paperclip, a as Mic } from "./MediaMessage-CzH0IhCZ.js";
import { c as composeEventHandlers, a as createSlottable, b as createContextScope } from "./index-C4-vroF6.js";
import { c as createLucideIcon, u as useComposedRefs, a as cn, b as buttonVariants, B as Button } from "./button-CQxG3T_J.js";
import { R as Root, b as Trigger, W as WarningProvider, C as Content, T as Title, D as Description, a as Close, c as createDialogScope, P as Portal, O as Overlay } from "./index-DfUxKoPk.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-DkW0CPeH.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
import { A as ArrowLeft } from "./arrow-left-BN3M1AU1.js";
import { L as LoaderCircle } from "./loader-circle-EI3rWnIU.js";
import { X } from "./x-Cj4_CEQM.js";
import { S as Send } from "./send-DuQhnxeL.js";
import { C as CircleCheck } from "./circle-check-CNxC-s1K.js";
import "./index-B-snK1QX.js";
import "./index-15HxH_qF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Trigger2 = AlertDialogTrigger$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger2, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
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
function MemberRow({ member }) {
  const { data: profile } = useUserProfile(member.userId);
  const name = (profile == null ? void 0 : profile.realName) ?? `${member.userId.toString().slice(0, 8)}…`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-8 h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary text-xs font-bold", children: initials(name) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full border border-card" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground truncate", children: name }),
      (profile == null ? void 0 : profile.isVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11, className: "text-blue-400 shrink-0" }),
      member.isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold text-accent bg-accent/10 px-1 rounded shrink-0", children: "Admin" })
    ] }) })
  ] });
}
function GroupDetailPage() {
  const { groupId } = useParams({ strict: false });
  let gid;
  try {
    gid = BigInt(groupId);
  } catch {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full gap-4",
        "data-ocid": "group_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 32, className: "text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Group not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "The group ID is invalid." })
        ]
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GroupDetailContent, { gid });
}
function GroupDetailContent({ gid }) {
  const { identity } = useAuth();
  const { data: group, isLoading: groupLoading } = useGroup(gid);
  const { data: messages, isLoading: msgLoading } = useGroupMessages(gid);
  const sendMessage = useSendGroupMessage();
  const leaveGroup = useLeaveGroup();
  const navigate = useNavigate();
  const [content, setContent] = reactExports.useState("");
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const [isRecording, setIsRecording] = reactExports.useState(false);
  const [recordingSeconds, setRecordingSeconds] = reactExports.useState(0);
  const mediaRecorderRef = reactExports.useRef(null);
  const audioChunksRef = reactExports.useRef([]);
  const recordingTimerRef = reactExports.useRef(null);
  const [lightboxUrl, setLightboxUrl] = reactExports.useState(null);
  const requestUploadUrl = useRequestMediaUploadUrl();
  const createCallRoom = useCreateCallRoom();
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  reactExports.useEffect(() => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  });
  const handleSend = async () => {
    var _a;
    if (!content.trim()) return;
    const msg = content.trim();
    setContent("");
    await sendMessage.mutateAsync({
      groupId: gid,
      content: msg,
      mediaType: MediaType.none
    });
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const handleLeave = async () => {
    await leaveGroup.mutateAsync(gid);
    ue.success("Left the group");
    navigate({ to: "/groups" });
  };
  const uploadAndSend = reactExports.useCallback(
    async (blob, mediaType, msgContent = "") => {
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
          groupId: gid,
          content: msgContent,
          mediaUrl: hash,
          mediaType
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        ue.error("Media upload failed", { description: msg });
      }
    },
    [gid, requestUploadUrl, sendMessage]
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
    const recipientId = group == null ? void 0 : group.creatorId;
    if (!recipientId) return;
    try {
      const room = await createCallRoom.mutateAsync({ recipientId, callType });
      window.open(room.roomUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Could not create call room";
      const isConfig = errMsg.toLowerCase().includes("api key") || errMsg.toLowerCase().includes("not configured");
      ue.error(isConfig ? "Calls not configured" : "Call failed", {
        description: isConfig ? "A Daily.co API key is required. Configure it in the Admin panel." : errMsg
      });
    }
  };
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
                "data-ocid": "group_detail.back_button",
                onClick: () => navigate({ to: "/groups" }),
                className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0",
                "aria-label": "Back to groups",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
              }
            ),
            groupLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-9 h-9 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary text-sm font-bold", children: group ? initials(group.name) : "?" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: (group == null ? void 0 : group.name) ?? "Group" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  (group == null ? void 0 : group.members.length) ?? 0,
                  " member",
                  ((group == null ? void 0 : group.members.length) ?? 0) !== 1 ? "s" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "group_detail.voice_call_button",
                  onClick: () => handleCall(CallType.voice),
                  disabled: createCallRoom.isPending,
                  className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50",
                  "aria-label": "Group voice call",
                  children: createCallRoom.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 15 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "group_detail.video_call_button",
                  onClick: () => handleCall(CallType.video),
                  disabled: createCallRoom.isPending,
                  className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-smooth disabled:opacity-50",
                  "aria-label": "Group video call",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 15 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "group_detail.members_button",
                  onClick: () => setSidebarOpen(!sidebarOpen),
                  className: `w-8 h-8 rounded-lg flex items-center justify-center transition-smooth ${sidebarOpen ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"}`,
                  "aria-label": "Toggle member list",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "group_detail.leave_open_modal_button",
                    className: "w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-smooth",
                    "aria-label": "Leave group",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 15 })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "group_detail.leave_dialog", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { className: "flex items-center gap-2 font-display", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 18, className: "text-destructive" }),
                      "Leave Group?"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                      "You will no longer receive messages from",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: group == null ? void 0 : group.name }),
                      ". You can rejoin if someone adds you back."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "group_detail.leave_cancel_button", children: "Stay" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AlertDialogAction,
                      {
                        "data-ocid": "group_detail.leave_confirm_button",
                        onClick: handleLeave,
                        className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                        children: "Leave Group"
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-1 bg-background", children: msgLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "space-y-3 pt-2",
              "data-ocid": "group_detail.loading_state",
              children: ["left-a", "right-a", "left-b", "right-b", "left-c"].map(
                (key) => {
                  const isRight = key.startsWith("right");
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `flex ${isRight ? "justify-end" : "justify-start"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Skeleton,
                        {
                          className: `h-10 rounded-2xl ${isRight ? "w-44" : "w-56"}`
                        }
                      )
                    },
                    key
                  );
                }
              )
            }
          ) : messages && messages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    "data-ocid": `group_detail.message.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `message-bubble max-w-[72%] ${isMine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card text-foreground rounded-bl-sm"}`,
                        style: !isMine ? {
                          border: "1px solid oklch(var(--border) / 0.4)"
                        } : void 0,
                        children: [
                          !isMine && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-primary mb-1", children: [
                            msg.senderId.toString().slice(0, 8),
                            "…"
                          ] }),
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
              "data-ocid": "group_detail.empty_state",
              className: "flex flex-col items-center justify-center h-full gap-4 pt-12",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary font-bold", children: group ? initials(group.name) : "?" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: (group == null ? void 0 : group.name) ?? "Group" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No messages yet — say hello to the group!" })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card px-3 py-2.5 flex items-center gap-2 shrink-0",
              style: { borderTop: "1px solid oklch(var(--border) / 0.5)" },
              children: isRecording ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-3 px-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: cancelRecording,
                    className: "w-8 h-8 rounded-full bg-destructive/15 hover:bg-destructive/25 text-destructive flex items-center justify-center transition-smooth shrink-0",
                    "aria-label": "Cancel recording",
                    "data-ocid": "group_detail.cancel_recording_button",
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
                    "data-ocid": "group_detail.send_voice_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                    "data-ocid": "group_detail.attach_button",
                    children: requestUploadUrl.isPending || sendMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: inputRef,
                    "data-ocid": "group_detail.message_input",
                    placeholder: `Message ${(group == null ? void 0 : group.name) ?? "group"}…`,
                    value: content,
                    onChange: (e) => setContent(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && !e.shiftKey && handleSend(),
                    className: "w-full bg-secondary rounded-xl px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50",
                    style: {
                      border: "1px solid oklch(var(--border) / 0.3)"
                    }
                  }
                ) }),
                content.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "group_detail.send_button",
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
                    "data-ocid": "group_detail.mic_button",
                    onMouseDown: startRecording,
                    onTouchStart: startRecording,
                    className: "w-9 h-9 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-smooth shrink-0",
                    "aria-label": "Hold to record voice message",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 16 })
                  }
                )
              ] })
            }
          )
        ] }),
        sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-56 bg-card flex-col overflow-y-auto shrink-0 hidden lg:flex",
            style: { borderLeft: "1px solid oklch(var(--border) / 0.4)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-4 py-3 flex items-center gap-2",
                  style: {
                    borderBottom: "1px solid oklch(var(--border) / 0.3)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                      "Members (",
                      (group == null ? void 0 : group.members.length) ?? 0,
                      ")"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2", children: groupLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-7 h-7 rounded-full shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 flex-1" })
              ] }, k)) }) : group == null ? void 0 : group.members.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                MemberRow,
                {
                  member
                },
                member.userId.toString()
              )) })
            ]
          }
        )
      ] })
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
              "data-ocid": "group_detail.lightbox_close_button",
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
  GroupDetailPage
};
