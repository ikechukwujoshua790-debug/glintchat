import { b as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-DFLYPydE.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { s as useChannels, w as useChannelPosts, x as usePostToChannel, v as useIsAdmin, L as Layout, R as Radio } from "./Layout-81mP_Nwv.js";
import { B as Badge } from "./badge-B0hJiIPp.js";
import { c as createLucideIcon, S as ShieldCheck, B as Button } from "./button-CQxG3T_J.js";
import { I as Input } from "./input-CD0LSYIs.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { A as ArrowLeft } from "./arrow-left-BN3M1AU1.js";
import { S as Send } from "./send-DuQhnxeL.js";
import "./useAuth-CCsbb51x.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }]
];
const Megaphone = createLucideIcon("megaphone", __iconNode);
function formatTime(ts) {
  const date = new Date(Number(ts / BigInt(1e6)));
  const now = /* @__PURE__ */ new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ChannelDetailPage() {
  const { channelId } = useParams({ strict: false });
  const cid = BigInt(channelId);
  const { data: channels } = useChannels();
  const { data: posts, isLoading } = useChannelPosts(cid);
  const postToChannel = usePostToChannel();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [content, setContent] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const channel = channels == null ? void 0 : channels.find((c) => c.id === cid);
  const postsCount = (posts == null ? void 0 : posts.length) ?? 0;
  reactExports.useEffect(() => {
    var _a;
    if (postsCount > 0) {
      (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }
  }, [postsCount]);
  const handlePost = async () => {
    const msg = content.trim();
    if (!msg) return;
    setContent("");
    await postToChannel.mutateAsync({ channelId: cid, content: msg });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-3 py-3 flex items-center gap-3 elevation-sm shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "channel_detail.back_button",
          "aria-label": "Back to channels",
          onClick: () => navigate({ to: "/channels" }),
          className: "w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 17 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 17, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: (channel == null ? void 0 : channel.name) ?? "Channel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0 h-4 bg-accent/15 text-accent border-accent/25 hover:bg-accent/15 shrink-0", children: "Official" })
        ] }),
        (channel == null ? void 0 : channel.description) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate mt-0.5", children: channel.description })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[10px] px-2 py-1 h-5 bg-primary/15 text-primary border-primary/25 hover:bg-primary/15 shrink-0 gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 10 }),
        "Admin"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 overflow-y-auto bg-background",
        role: "log",
        "aria-live": "polite",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card rounded-xl p-4 border border-border space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-5 h-5 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 ml-auto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3" })
            ]
          },
          i
        )) }) : posts && posts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/8 border border-primary/15 text-xs text-primary/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Official announcements only. Only admins can post." })
          ] }),
          posts.map((post, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `channel_detail.post.${idx + 1}`,
              className: "bg-card border border-border rounded-xl p-4 transition-smooth hover:border-border/80",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-primary/10 rounded-full px-2 py-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11, className: "text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-primary", children: "GlintChat Admin" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground ml-auto shrink-0", children: formatTime(post.postedAt) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: post.content })
              ]
            },
            post.id.toString()
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "channel_detail.empty_state",
            className: "flex flex-col items-center justify-center h-full min-h-[260px] gap-4 text-center px-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { size: 28, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No announcements yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: isAdmin ? "Post the first announcement to this channel" : "Stay tuned for official updates" })
              ] })
            ]
          }
        )
      }
    ),
    isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border p-3 flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "channel_detail.message_input",
          placeholder: "Broadcast an announcement…",
          value: content,
          onChange: (e) => setContent(e.target.value),
          onKeyDown: handleKeyDown,
          className: "flex-1 bg-secondary border-transparent focus:border-primary/40 h-9 text-sm"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "channel_detail.send_button",
          size: "icon",
          onClick: handlePost,
          disabled: !content.trim() || postToChannel.isPending,
          "aria-label": "Send announcement",
          className: "shrink-0 h-9 w-9",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 15 })
        }
      )
    ] }) : (
      /* Read-only notice for regular users */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border px-4 py-2.5 flex items-center justify-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Read-only — only admins can post in official channels" })
      ] })
    )
  ] }) }) });
}
export {
  ChannelDetailPage
};
