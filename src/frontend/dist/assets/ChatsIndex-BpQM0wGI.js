import { r as reactExports, j as jsxRuntimeExports, u as useNavigate, a as LogoWithText, P as Principal } from "./index-DFLYPydE.js";
import { P as Phone, u as ue } from "./index-CdinL_su.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { u as useCallerProfile, a as useMyGroups, b as useAdminUsers, L as Layout, U as Users, c as useGetUserByPhone } from "./Layout-81mP_Nwv.js";
import { c as createLucideIcon, B as Button, a as cn } from "./button-CQxG3T_J.js";
import { X } from "./x-Cj4_CEQM.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-DkW0CPeH.js";
import { B as Badge } from "./badge-B0hJiIPp.js";
import { I as Input } from "./input-CD0LSYIs.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-DfUxKoPk.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
import { SignupPage } from "./SignupPage-DWnzWd4e.js";
import { Q as QrCode } from "./qr-code-5IYm5C5u.js";
import { C as CircleCheck } from "./circle-check-CNxC-s1K.js";
import "./index-B-snK1QX.js";
import "./index-15HxH_qF.js";
import "./index-C4-vroF6.js";
import "./label-HwO092Ix.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M12 7v6", key: "lw1j43" }],
  ["path", { d: "M9 10h6", key: "9gxzsh" }]
];
const MessageSquarePlus = createLucideIcon("message-square-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
function QRScanner({ onScan, onClose }) {
  const videoRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const animFrameRef = reactExports.useRef(0);
  const [error, setError] = reactExports.useState(null);
  const [scanning, setScanning] = reactExports.useState(false);
  const stopCamera = reactExports.useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
    }
    streamRef.current = null;
  }, []);
  const startCamera = reactExports.useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
      }
      if ("BarcodeDetector" in window) {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const scan = async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(scan);
            return;
          }
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              stopCamera();
              onScan(barcodes[0].rawValue);
              return;
            }
          } catch {
          }
          animFrameRef.current = requestAnimationFrame(scan);
        };
        animFrameRef.current = requestAnimationFrame(scan);
      } else {
        setError(
          "Your browser doesn't support QR scanning. Try Chrome or Safari on a modern device."
        );
      }
    } catch {
      setError(
        "Camera access denied. Please allow camera permissions to scan QR codes."
      );
    }
  }, [onScan, stopCamera]);
  reactExports.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "qr_scanner.dialog",
      className: "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Scan QR Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Point your camera at a GlintChat QR code" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "qr_scanner.close_button",
              onClick: () => {
                stopCamera();
                onClose();
              },
              className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Close scanner",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-card rounded-2xl overflow-hidden aspect-square border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              className: "w-full h-full object-cover",
              muted: true,
              playsInline: true,
              "aria-label": "Camera viewfinder"
            }
          ),
          scanning && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-48 h-48", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute top-0 left-0 right-0 h-0.5 bg-primary/70 animate-bounce",
                style: { animationDuration: "2s" }
              }
            )
          ] }) }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 bg-card/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 32, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground", children: error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "qr_scanner.retry_button",
                size: "sm",
                variant: "outline",
                onClick: startCamera,
                children: "Try Again"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-4", children: "Scanning automatically when QR code is detected" })
      ] })
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatRelativeTime(ts) {
  const ms = Number(ts / BigInt(1e6));
  const diff = Date.now() - ms;
  if (diff < 6e4) return "now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function GroupRow({
  group,
  index,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `chats.group.item.${index}`,
      onClick,
      className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-smooth text-left",
      style: { borderBottom: "1px solid oklch(var(--border) / 0.2)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-12 h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary font-semibold text-sm", children: initials(group.name) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: group.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground shrink-0", children: formatRelativeTime(group.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10, className: "shrink-0" }),
            group.members.length,
            " member",
            group.members.length !== 1 ? "s" : ""
          ] })
        ] })
      ]
    }
  );
}
function DmRow({
  user,
  index,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `chats.dm.item.${index}`,
      onClick,
      className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-smooth text-left",
      style: { borderBottom: "1px solid oklch(var(--border) / 0.2)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-12 h-12 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-accent/20 text-accent font-semibold text-sm", children: initials(user.realName) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: user.realName }),
            user.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleCheck,
              {
                size: 13,
                className: "text-blue-400 shrink-0",
                "aria-label": "Verified"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: "Tap to open conversation" })
        ] })
      ]
    }
  );
}
function ContactPickerSheet({
  open,
  onClose,
  currentUserId,
  users,
  isLoading,
  onSelect
}) {
  const [query, setQuery] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) => u.id.toString() !== currentUserId && (u.realName.toLowerCase().includes(q) || u.phone.toLowerCase().includes(q))
    );
  }, [users, currentUserId, query]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "bottom",
      "data-ocid": "chats.contact_picker.sheet",
      className: "rounded-t-2xl max-h-[80dvh] flex flex-col p-0",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "px-4 pt-4 pb-3 border-b border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "font-display text-base", children: "New Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "chats.contact_picker.close_button",
                onClick: onClose,
                className: "w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Search,
              {
                size: 13,
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "chats.contact_picker.search_input",
                placeholder: "Search by name or phone…",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                className: "pl-8 h-9 bg-secondary border-transparent focus:border-primary/40 text-sm",
                autoFocus: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-1 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
          ] })
        ] }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "chats.contact_picker.empty_state",
            className: "flex flex-col items-center justify-center py-16 px-6 gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: query ? "No users found" : "No other users yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: query ? "Try a different name or phone number" : "Invite friends to join GlintChat" })
            ]
          }
        ) : filtered.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `chats.contact_picker.item.${idx + 1}`,
            onClick: () => {
              onSelect(user.id.toString());
              onClose();
            },
            className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-smooth text-left",
            style: {
              borderBottom: "1px solid oklch(var(--border) / 0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary text-xs font-semibold", children: initials(user.realName) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: user.realName }),
                  user.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleCheck,
                    {
                      size: 12,
                      className: "text-blue-400 shrink-0",
                      "aria-label": "Verified"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.phone })
              ] })
            ]
          },
          user.id.toString()
        )) })
      ]
    }
  ) });
}
function NewContactSheet({
  open,
  onClose,
  onNavigate
}) {
  const [phone, setPhone] = reactExports.useState("");
  const [result, setResult] = reactExports.useState("idle");
  const getUserByPhone = useGetUserByPhone();
  const handleSearch = async () => {
    if (!phone.trim()) return;
    setResult("idle");
    try {
      const user = await getUserByPhone.mutateAsync(phone.trim());
      if (user) {
        onNavigate(user.id.toString());
        onClose();
        setPhone("");
        setResult("idle");
      } else {
        setResult("not_found");
      }
    } catch {
      setResult("not_found");
    }
  };
  const handleClose = () => {
    setPhone("");
    setResult("idle");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "bottom",
      "data-ocid": "chats.new_contact.sheet",
      className: "rounded-t-2xl p-0",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "px-4 pt-4 pb-3 border-b border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "font-display text-base flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 16, className: "text-primary" }),
              "New Contact"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "chats.new_contact.close_button",
                onClick: handleClose,
                className: "w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-left", children: "Enter a phone number to find a GlintChat user" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "chats.new_contact.phone_input",
                placeholder: "+1 555 000 0000",
                value: phone,
                onChange: (e) => {
                  setPhone(e.target.value);
                  setResult("idle");
                },
                onKeyDown: (e) => e.key === "Enter" && handleSearch(),
                className: "flex-1 bg-secondary border-transparent focus:border-primary/40 text-sm",
                type: "tel",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "chats.new_contact.search_button",
                onClick: handleSearch,
                disabled: !phone.trim() || getUserByPhone.isPending,
                className: "shrink-0",
                size: "sm",
                children: getUserByPhone.isPending ? "Searching…" : "Find"
              }
            )
          ] }),
          result === "not_found" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "chats.new_contact.not_found_state",
              className: "flex items-center gap-2 p-3 bg-secondary/50 rounded-lg",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "No GlintChat user found with that number." })
            }
          )
        ] })
      ]
    }
  ) });
}
function ChatsIndexPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched
  } = useCallerProfile();
  const { data: groups, isLoading: groupsLoading } = useMyGroups();
  const { data: allUsers, isLoading: usersLoading } = useAdminUsers();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const [newContactOpen, setNewContactOpen] = reactExports.useState(false);
  const [scannerOpen, setScannerOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && profile === null;
  const currentUserId = (profile == null ? void 0 : profile.id.toString()) ?? "";
  const filteredGroups = (groups == null ? void 0 : groups.filter(
    (g) => g.name.toLowerCase().includes(search.toLowerCase())
  )) ?? [];
  const filteredDms = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return (allUsers ?? []).filter(
      (u) => u.id.toString() !== currentUserId && (u.realName.toLowerCase().includes(q) || u.phone.toLowerCase().includes(q))
    );
  }, [allUsers, currentUserId, search]);
  const isEmpty = filteredGroups.length === 0 && filteredDms.length === 0;
  const handleQRScan = (raw) => {
    setScannerOpen(false);
    let userId = raw;
    if (raw.startsWith("glintchat://profile/")) {
      userId = raw.replace("glintchat://profile/", "");
    } else if (raw.startsWith("profile/")) {
      userId = raw.replace("profile/", "");
    }
    try {
      Principal.fromText(userId);
      navigate({ to: "/chats/$userId", params: { userId } });
    } catch {
      ue.error("Invalid QR code. Please scan a GlintChat profile code.");
    }
  };
  if (isInitializing || !isFetched && isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48" })
      ] })
    ] }, i)) }) }) });
  }
  if (showProfileSetup) return /* @__PURE__ */ jsxRuntimeExports.jsx(SignupPage, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full md:w-80 lg:w-96 flex flex-col bg-card",
          style: { borderRight: "1px solid oklch(var(--border) / 0.4)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 pt-4 pb-3",
                style: { borderBottom: "1px solid oklch(var(--border) / 0.4)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogoWithText, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground tracking-tight", children: "Conversations" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "chats.scan_code_button",
                          onClick: () => setScannerOpen(true),
                          className: "w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center",
                          "aria-label": "Scan QR code",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { size: 15 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "chats.new_contact_button",
                          onClick: () => setNewContactOpen(true),
                          className: "w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center",
                          "aria-label": "Add contact by phone",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 15 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "chats.new_group_button",
                          onClick: () => navigate({ to: "/groups" }),
                          className: "w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center",
                          "aria-label": "View groups",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 15 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "chats.new_chat_button",
                          onClick: () => setPickerOpen(true),
                          className: "w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center",
                          "aria-label": "New chat",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 15 })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Search,
                      {
                        size: 14,
                        className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        "data-ocid": "chats.search_input",
                        placeholder: "Search conversations…",
                        value: search,
                        onChange: (e) => setSearch(e.target.value),
                        className: "pl-9 h-9 bg-secondary border-transparent focus:border-primary/40 text-sm"
                      }
                    )
                  ] })
                ]
              }
            ),
            profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 py-2.5 flex items-center gap-3 bg-secondary/20",
                style: {
                  borderBottom: "1px solid oklch(var(--border) / 0.25)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-8 h-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/25 text-primary text-xs font-bold", children: initials(profile.realName) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-xs text-foreground truncate", children: profile.realName }),
                      profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleCheck,
                        {
                          size: 13,
                          className: "text-blue-400 shrink-0",
                          "aria-label": "Verified"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-primary font-medium", children: "● Online" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: groupsLoading || usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-1", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-1 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-40" })
              ] })
            ] }, i)) }) : isEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "chats.empty_state",
                className: "flex flex-col items-center justify-center py-20 px-6 gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquarePlus, { size: 26, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: search ? "No results found" : "No conversations yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: search ? "Try a different search term" : "Start a new chat or join a group" })
                  ] }),
                  !search && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "chats.start_chat_button",
                        onClick: () => setPickerOpen(true),
                        className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-smooth",
                        children: "Start a Chat"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "chats.add_by_phone_button",
                        onClick: () => setNewContactOpen(true),
                        className: "px-4 py-2 bg-secondary text-foreground rounded-lg text-xs font-semibold hover:bg-secondary/70 transition-smooth flex items-center gap-1.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
                          "By Phone"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              filteredGroups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-4 py-2 bg-secondary/30",
                    style: {
                      borderBottom: "1px solid oklch(var(--border) / 0.2)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest", children: "Groups" })
                  }
                ),
                filteredGroups.map((group, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  GroupRow,
                  {
                    group,
                    index: idx + 1,
                    onClick: () => navigate({
                      to: "/groups/$groupId",
                      params: { groupId: group.id.toString() }
                    })
                  },
                  group.id.toString()
                ))
              ] }),
              filteredDms.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-4 py-2 bg-secondary/30",
                    style: {
                      borderBottom: "1px solid oklch(var(--border) / 0.2)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-widest", children: "Direct Messages" })
                  }
                ),
                filteredDms.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DmRow,
                  {
                    user,
                    index: idx + 1,
                    onClick: () => navigate({
                      to: "/chats/$userId",
                      params: { userId: user.id.toString() }
                    })
                  },
                  user.id.toString()
                ))
              ] })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex flex-1 flex-col items-center justify-center bg-background gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-20 h-20 rounded-3xl bg-card border flex items-center justify-center elevation-sm",
            style: { borderColor: "oklch(var(--border) / 0.5)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquarePlus, { size: 36, className: "text-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground", children: "Select a conversation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Choose a chat or group from the list to start messaging" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-accent border-accent/30 bg-accent/5 text-xs",
            children: "GlintChat — Private & Secure"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContactPickerSheet,
      {
        open: pickerOpen,
        onClose: () => setPickerOpen(false),
        currentUserId,
        users: allUsers ?? [],
        isLoading: usersLoading,
        onSelect: (userId) => navigate({ to: "/chats/$userId", params: { userId } })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewContactSheet,
      {
        open: newContactOpen,
        onClose: () => setNewContactOpen(false),
        onNavigate: (userId) => navigate({ to: "/chats/$userId", params: { userId } })
      }
    ),
    scannerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      QRScanner,
      {
        onScan: handleQRScan,
        onClose: () => setScannerOpen(false)
      }
    )
  ] }) });
}
export {
  ChatsIndexPage
};
