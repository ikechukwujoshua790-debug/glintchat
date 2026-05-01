import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-DFLYPydE.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { a as useMyGroups, u as useCallerProfile, j as useCreateGroup, L as Layout, U as Users } from "./Layout-81mP_Nwv.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-DkW0CPeH.js";
import { B as Badge } from "./badge-B0hJiIPp.js";
import { B as Button } from "./button-CQxG3T_J.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-BldtB1mg.js";
import { I as Input } from "./input-CD0LSYIs.js";
import { L as Label } from "./label-HwO092Ix.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { C as CircleCheck } from "./circle-check-CNxC-s1K.js";
import "./useAuth-CCsbb51x.js";
import "./index-B-snK1QX.js";
import "./index-15HxH_qF.js";
import "./index-DfUxKoPk.js";
import "./index-C4-vroF6.js";
import "./x-Cj4_CEQM.js";
function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatRelativeTime(ts) {
  const ms = Number(ts / BigInt(1e6));
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function GroupsPage() {
  const { data: groups, isLoading } = useMyGroups();
  const { data: profile } = useCallerProfile();
  const createGroup = useCreateGroup();
  const navigate = useNavigate();
  const [open, setOpen] = reactExports.useState(false);
  const [groupName, setGroupName] = reactExports.useState("");
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    const created = await createGroup.mutateAsync(groupName.trim());
    setGroupName("");
    setOpen(false);
    navigate({
      to: "/groups/$groupId",
      params: { groupId: created.id.toString() }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card px-5 py-4 flex items-center justify-between shrink-0",
        style: { borderBottom: "1px solid oklch(var(--border) / 0.5)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground tracking-tight", children: "Groups" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              (groups == null ? void 0 : groups.length) ?? 0,
              " group",
              ((groups == null ? void 0 : groups.length) ?? 0) !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "groups.create_button",
                size: "sm",
                className: "gap-2 h-9 px-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                  "New Group"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "groups.dialog", className: "sm:max-w-md", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-bold", children: "Create a Group" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-5 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groupName", className: "text-sm font-medium", children: "Group Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "groupName",
                      "data-ocid": "groups.name_input",
                      placeholder: "e.g. Design Team, Family Chat…",
                      value: groupName,
                      onChange: (e) => setGroupName(e.target.value),
                      autoFocus: true,
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You can change this later" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "groups.cancel_button",
                      type: "button",
                      variant: "outline",
                      onClick: () => setOpen(false),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "groups.submit_button",
                      type: "submit",
                      disabled: createGroup.isPending || !groupName.trim(),
                      children: createGroup.isPending ? "Creating…" : "Create Group"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mx-4 mt-4 p-3 rounded-xl bg-card flex items-center gap-3",
        style: { border: "1px solid oklch(var(--border) / 0.4)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-10 h-10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/25 text-primary font-bold text-sm", children: initials(profile.realName) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: profile.realName }),
              profile.isVerified ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleCheck,
                {
                  size: 14,
                  className: "text-blue-400 shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] h-4 px-1.5 text-accent border-accent/30 bg-accent/5",
                  children: "Unverified"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: profile.phone })
          ] }),
          !profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "text-xs h-7 px-2.5 border-primary/30 text-primary hover:bg-primary/10 shrink-0",
              onClick: () => navigate({ to: "/verify" }),
              "data-ocid": "groups.get_verified_button",
              children: "Get Verified"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 p-3 bg-card rounded-xl",
        style: { border: "1px solid oklch(var(--border) / 0.3)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
          ] })
        ]
      },
      i
    )) }) : groups && groups.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: groups.map((group, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `groups.item.${idx + 1}`,
        onClick: () => navigate({
          to: "/groups/$groupId",
          params: { groupId: group.id.toString() }
        }),
        className: "w-full flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-secondary/30 transition-smooth text-left group",
        style: { border: "1px solid oklch(var(--border) / 0.4)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-12 h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary font-bold text-sm", children: initials(group.name) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate group-hover:text-primary transition-smooth", children: group.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground shrink-0", children: formatRelativeTime(group.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 10, className: "shrink-0" }),
              group.members.length,
              " member",
              group.members.length !== 1 ? "s" : ""
            ] })
          ] })
        ]
      },
      group.id.toString()
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "groups.empty_state",
        className: "flex flex-col items-center justify-center h-64 gap-5 mt-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No groups yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create a group to chat with multiple people at once" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "groups.create_first_button",
              onClick: () => setOpen(true),
              size: "sm",
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
                "Create First Group"
              ]
            }
          )
        ]
      }
    ) })
  ] }) }) });
}
export {
  GroupsPage
};
