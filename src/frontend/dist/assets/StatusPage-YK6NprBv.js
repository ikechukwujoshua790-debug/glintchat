import { r as reactExports, j as jsxRuntimeExports } from "./index-DFLYPydE.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { u as useCallerProfile, p as useActiveStatusPosts, q as useCreateStatusPost, r as useDeleteStatusPost, L as Layout, e as useUserProfile } from "./Layout-81mP_Nwv.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-DkW0CPeH.js";
import { c as createLucideIcon, B as Button } from "./button-CQxG3T_J.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-BldtB1mg.js";
import { L as Label } from "./label-HwO092Ix.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { T as Textarea } from "./textarea-CwcAkr0h.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
import { C as Clock } from "./clock-DM8V-HRX.js";
import { B as BadgeCheck } from "./badge-check-B9svzj52.js";
import "./index-B-snK1QX.js";
import "./index-15HxH_qF.js";
import "./index-DfUxKoPk.js";
import "./index-C4-vroF6.js";
import "./x-Cj4_CEQM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function msLeft(expiresAt) {
  const exp = Number(expiresAt / BigInt(1e6));
  return exp - Date.now();
}
function formatCountdown(ms) {
  if (ms <= 0) return "Expired";
  const totalSecs = Math.floor(ms / 1e3);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor(totalSecs % 3600 / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}
function formatPostedAt(createdAt) {
  const ts = Number(createdAt / BigInt(1e6));
  const date = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 6e4) return "Just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
function countdownClass(ms) {
  if (ms <= 0) return "text-destructive";
  if (ms < 36e5) return "text-destructive/80";
  if (ms < 6 * 36e5) return "text-accent";
  return "text-muted-foreground";
}
function useCountdown(expiresAt) {
  const [ms, setMs] = reactExports.useState(() => msLeft(expiresAt));
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setMs(msLeft(expiresAt));
    }, 1e3);
    return () => clearInterval(interval);
  }, [expiresAt]);
  return ms;
}
function StatusAuthor({ authorId }) {
  const { data: profile } = useUserProfile(
    authorId
  );
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground leading-tight", children: profile.realName }),
    profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BadgeCheck,
      {
        size: 14,
        className: "text-accent shrink-0",
        "aria-label": "Verified"
      }
    )
  ] });
}
function StatusAvatar({
  authorId,
  profile
}) {
  const initials = (profile == null ? void 0 : profile.realName) ? getInitials(profile.realName) : authorId.toString().slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-11 h-11 shrink-0 ring-2 ring-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-sm font-bold", children: initials }) });
}
function StatusCountdown({ expiresAt }) {
  const remaining = useCountdown(expiresAt);
  const progress = Math.max(0, Math.min(1, remaining / (24 * 36e5)));
  const circumference = 2 * Math.PI * 10;
  const strokeDash = circumference * progress;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        className: "shrink-0 -rotate-90",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "12",
              cy: "12",
              r: "10",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              className: "text-border opacity-40"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "12",
              cy: "12",
              r: "10",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeDasharray: `${strokeDash} ${circumference}`,
              strokeLinecap: "round",
              className: remaining < 36e5 ? "text-destructive" : remaining < 6 * 36e5 ? "text-accent" : "text-primary"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-xs font-medium tabular-nums ${countdownClass(remaining)}`,
        children: formatCountdown(remaining)
      }
    )
  ] });
}
function StatusCard({
  post,
  isMine,
  idx,
  onDelete,
  isDeleting
}) {
  const { data: profile } = useUserProfile(
    post.authorId
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `status.item.${idx}`,
      className: "status-card p-4 group transition-smooth hover:elevation-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusAvatar, { authorId: post.authorId, profile }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusAuthor, { authorId: post.authorId }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatPostedAt(post.createdAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border/60 text-xs", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusCountdown, { expiresAt: post.expiresAt })
              ] })
            ] })
          ] }),
          isMine && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `status.delete_button.${idx}`,
              onClick: onDelete,
              disabled: isDeleting,
              className: "w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 disabled:opacity-50",
              "aria-label": "Delete status",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground mt-3 leading-relaxed break-words", children: post.content }),
        isMine && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border/30 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Your post" })
        ] })
      ]
    }
  );
}
function PostSkeletons() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-11 h-11 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5" })
    ] })
  ] }, i)) });
}
function StatusPage() {
  const { identity } = useAuth();
  const { data: callerProfile } = useCallerProfile();
  const {
    data: posts,
    isLoading,
    refetch,
    dataUpdatedAt
  } = useActiveStatusPosts();
  const createPost = useCreateStatusPost();
  const deletePost = useDeleteStatusPost();
  const [open, setOpen] = reactExports.useState(false);
  const [content, setContent] = reactExports.useState("");
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3e4);
    return () => clearInterval(interval);
  }, [refetch]);
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createPost.mutateAsync(content.trim());
    setContent("");
    setOpen(false);
  };
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b px-4 py-4 flex items-center justify-between shrink-0 elevation-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        callerProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-9 h-9 ring-2 ring-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-sm font-bold", children: getInitials(callerProfile.realName) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-lg text-foreground leading-tight", children: "Status" }),
            posts && posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold tabular-nums", children: posts.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
            "Posts auto-expire in 24 hours",
            lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-border/70 ml-1", children: [
              "· ",
              lastUpdated
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "status.refresh_button",
            onClick: () => refetch(),
            className: "w-8 h-8 rounded-lg hover:bg-muted transition-smooth flex items-center justify-center text-muted-foreground hover:text-foreground",
            "aria-label": "Refresh feed",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "status.new_post_button",
              size: "sm",
              className: "gap-1.5 font-semibold",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                "Post"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "status.dialog", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Share a Status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-4 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "statusContent", children: "What's on your mind?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "statusContent",
                    "data-ocid": "status.content_input",
                    placeholder: "Share something with your contacts…",
                    value: content,
                    onChange: (e) => setContent(e.target.value),
                    rows: 4,
                    maxLength: 500,
                    required: true,
                    className: "resize-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                    "Disappears after 24 hours"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                    content.length,
                    "/500"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "status.cancel_button",
                    type: "button",
                    variant: "outline",
                    onClick: () => {
                      setOpen(false);
                      setContent("");
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "status.submit_button",
                    type: "submit",
                    disabled: createPost.isPending || !content.trim(),
                    children: createPost.isPending ? "Posting…" : "Post Status"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto p-4 space-y-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PostSkeletons, {}) : posts && posts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: posts.slice().sort((a, b) => {
      const aMine = a.authorId.toString() === myPrincipal ? -1 : 0;
      const bMine = b.authorId.toString() === myPrincipal ? -1 : 0;
      if (aMine !== bMine) return aMine - bMine;
      return Number(b.createdAt - a.createdAt);
    }).map((post, idx) => {
      const isMine = post.authorId.toString() === myPrincipal;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatusCard,
        {
          post,
          isMine,
          idx: idx + 1,
          onDelete: () => deletePost.mutate(post.id),
          isDeleting: deletePost.isPending
        },
        post.id.toString()
      );
    }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "status.empty_state",
        className: "flex flex-col items-center justify-center py-24 gap-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center elevation-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 32, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg", children: "No status updates yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Be the first to share a 24-hour status with your contacts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "status.empty_post_button",
              onClick: () => setOpen(true),
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                "Post a Status"
              ]
            }
          )
        ]
      }
    ) }) })
  ] }) }) });
}
export {
  StatusPage
};
