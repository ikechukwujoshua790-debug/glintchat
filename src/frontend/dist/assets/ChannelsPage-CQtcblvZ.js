import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-DFLYPydE.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { s as useChannels, t as useCreateChannel, v as useIsAdmin, L as Layout, R as Radio, H as Hash } from "./Layout-81mP_Nwv.js";
import { B as Badge } from "./badge-B0hJiIPp.js";
import { B as Button } from "./button-CQxG3T_J.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-BldtB1mg.js";
import { I as Input } from "./input-CD0LSYIs.js";
import { L as Label } from "./label-HwO092Ix.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { T as Textarea } from "./textarea-CwcAkr0h.js";
import { L as Lock } from "./lock-C3cDJ3EE.js";
import "./useAuth-CCsbb51x.js";
import "./index-DfUxKoPk.js";
import "./index-C4-vroF6.js";
import "./index-B-snK1QX.js";
import "./x-Cj4_CEQM.js";
import "./index-15HxH_qF.js";
function ChannelsPage() {
  const { data: channels, isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createChannel.mutateAsync({
      name: name.trim(),
      description: description.trim()
    });
    setName("");
    setDescription("");
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-4 py-4 flex items-center justify-between shrink-0 elevation-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 18, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-base text-foreground leading-tight", children: "Official Channels" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
            "Admin-only broadcasting"
          ] })
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "channels.create_button",
            size: "sm",
            className: "gap-1.5 h-8 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              "New Channel"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "channels.dialog", className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Create Official Channel" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-4 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "channelName", className: "text-xs", children: "Channel Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "channelName",
                  "data-ocid": "channels.name_input",
                  placeholder: "e.g. Announcements",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  required: true,
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "channelDesc", className: "text-xs", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "channelDesc",
                  "data-ocid": "channels.description_input",
                  placeholder: "What is this channel about?",
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  rows: 3,
                  className: "resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "channels.cancel_button",
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setOpen(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "channels.submit_button",
                  type: "submit",
                  size: "sm",
                  disabled: createChannel.isPending || !name.trim(),
                  children: createChannel.isPending ? "Creating…" : "Create"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card rounded-xl p-4 border border-border space-y-2",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56" })
          ] })
        ] })
      },
      i
    )) }) : channels && channels.length > 0 ? channels.map((channel, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `channels.item.${idx + 1}`,
        onClick: () => navigate({
          to: "/channels/$channelId",
          params: { channelId: channel.id.toString() }
        }),
        className: "w-full flex items-center gap-3 p-3.5 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-secondary/40 transition-smooth text-left group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 19, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground truncate", children: channel.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0 h-4 bg-accent/15 text-accent border-accent/25 hover:bg-accent/15 shrink-0", children: "Official" })
            ] }),
            channel.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: channel.description }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/50 mt-0.5 italic", children: "No description" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground/40 group-hover:text-primary/60 transition-smooth shrink-0 text-lg leading-none", children: "›" })
        ]
      },
      channel.id.toString()
    )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "channels.empty_state",
        className: "flex flex-col items-center justify-center h-64 gap-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 28, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No channels yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-[220px]", children: isAdmin ? "Create a channel to start broadcasting announcements" : "Check back soon for official updates from GlintChat" })
          ] }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "gap-1.5",
              onClick: () => setOpen(true),
              "data-ocid": "channels.empty_create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                "Create First Channel"
              ]
            }
          )
        ]
      }
    ) })
  ] }) }) });
}
export {
  ChannelsPage
};
