import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import {
  useCallerProfile,
  useCreateGroup,
  useMyGroups,
} from "../hooks/useBackend";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function GroupsPage() {
  const { data: groups, isLoading } = useMyGroups();
  const { data: profile } = useCallerProfile();
  const createGroup = useCreateGroup();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    const created = await createGroup.mutateAsync(groupName.trim());
    setGroupName("");
    setOpen(false);
    navigate({
      to: "/groups/$groupId",
      params: { groupId: created.id.toString() },
    });
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div
            className="bg-card px-5 py-4 flex items-center justify-between shrink-0"
            style={{ borderBottom: "1px solid oklch(var(--border) / 0.5)" }}
          >
            <div>
              <h1 className="font-display font-bold text-xl text-foreground tracking-tight">
                Groups
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {groups?.length ?? 0} group
                {(groups?.length ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="groups.create_button"
                  size="sm"
                  className="gap-2 h-9 px-4"
                >
                  <Plus size={15} />
                  New Group
                </Button>
              </DialogTrigger>
              <DialogContent data-ocid="groups.dialog" className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display font-bold">
                    Create a Group
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-5 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="groupName" className="text-sm font-medium">
                      Group Name
                    </Label>
                    <Input
                      id="groupName"
                      data-ocid="groups.name_input"
                      placeholder="e.g. Design Team, Family Chat…"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      autoFocus
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You can change this later
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <Button
                      data-ocid="groups.cancel_button"
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      data-ocid="groups.submit_button"
                      type="submit"
                      disabled={createGroup.isPending || !groupName.trim()}
                    >
                      {createGroup.isPending ? "Creating…" : "Create Group"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* My profile card */}
          {profile && (
            <div
              className="mx-4 mt-4 p-3 rounded-xl bg-card flex items-center gap-3"
              style={{ border: "1px solid oklch(var(--border) / 0.4)" }}
            >
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarFallback className="bg-primary/25 text-primary font-bold text-sm">
                  {initials(profile.realName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {profile.realName}
                  </span>
                  {profile.isVerified ? (
                    <CheckCircle2
                      size={14}
                      className="text-blue-400 shrink-0"
                    />
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1.5 text-accent border-accent/30 bg-accent/5"
                    >
                      Unverified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{profile.phone}</p>
              </div>
              {!profile.isVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2.5 border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                  onClick={() => navigate({ to: "/verify" })}
                  data-ocid="groups.get_verified_button"
                >
                  Get Verified
                </Button>
              )}
            </div>
          )}

          {/* Groups list */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl"
                    style={{ border: "1px solid oklch(var(--border) / 0.3)" }}
                  >
                    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : groups && groups.length > 0 ? (
              <div className="space-y-2">
                {groups.map((group, idx) => (
                  <button
                    key={group.id.toString()}
                    type="button"
                    data-ocid={`groups.item.${idx + 1}`}
                    onClick={() =>
                      navigate({
                        to: "/groups/$groupId",
                        params: { groupId: group.id.toString() },
                      })
                    }
                    className="w-full flex items-center gap-3 p-3 bg-card rounded-xl hover:bg-secondary/30 transition-smooth text-left group"
                    style={{ border: "1px solid oklch(var(--border) / 0.4)" }}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
                          {initials(group.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-smooth">
                          {group.name}
                        </p>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {formatRelativeTime(group.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Users size={10} className="shrink-0" />
                        {group.members.length} member
                        {group.members.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div
                data-ocid="groups.empty_state"
                className="flex flex-col items-center justify-center h-64 gap-5 mt-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users size={28} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">No groups yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a group to chat with multiple people at once
                  </p>
                </div>
                <Button
                  data-ocid="groups.create_first_button"
                  onClick={() => setOpen(true)}
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={15} />
                  Create First Group
                </Button>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
