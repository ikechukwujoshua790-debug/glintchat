import { useNavigate } from "@tanstack/react-router";
import { Hash, Lock, Plus, Radio } from "lucide-react";
import { useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
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
import { Textarea } from "../components/ui/textarea";
import { useChannels, useCreateChannel, useIsAdmin } from "../hooks/useBackend";

export function ChannelsPage() {
  const { data: channels, isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createChannel.mutateAsync({
      name: name.trim(),
      description: description.trim(),
    });
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div className="bg-card border-b border-border px-4 py-4 flex items-center justify-between shrink-0 elevation-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <Radio size={18} className="text-primary" />
              </div>
              <div>
                <h1 className="font-display font-semibold text-base text-foreground leading-tight">
                  Official Channels
                </h1>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Lock size={10} />
                  Admin-only broadcasting
                </p>
              </div>
            </div>
            {isAdmin && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    data-ocid="channels.create_button"
                    size="sm"
                    className="gap-1.5 h-8 text-xs"
                  >
                    <Plus size={14} />
                    New Channel
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="channels.dialog" className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      Create Official Channel
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <Label htmlFor="channelName" className="text-xs">
                        Channel Name
                      </Label>
                      <Input
                        id="channelName"
                        data-ocid="channels.name_input"
                        placeholder="e.g. Announcements"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="channelDesc" className="text-xs">
                        Description
                      </Label>
                      <Textarea
                        id="channelDesc"
                        data-ocid="channels.description_input"
                        placeholder="What is this channel about?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button
                        data-ocid="channels.cancel_button"
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        data-ocid="channels.submit_button"
                        type="submit"
                        size="sm"
                        disabled={createChannel.isPending || !name.trim()}
                      >
                        {createChannel.isPending ? "Creating…" : "Create"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-4 border border-border space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : channels && channels.length > 0 ? (
              channels.map((channel, idx) => (
                <button
                  key={channel.id.toString()}
                  type="button"
                  data-ocid={`channels.item.${idx + 1}`}
                  onClick={() =>
                    navigate({
                      to: "/channels/$channelId",
                      params: { channelId: channel.id.toString() },
                    })
                  }
                  className="w-full flex items-center gap-3 p-3.5 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-secondary/40 transition-smooth text-left group"
                >
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-smooth">
                    <Hash size={19} className="text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground truncate">
                        {channel.name}
                      </span>
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-accent/15 text-accent border-accent/25 hover:bg-accent/15 shrink-0">
                        Official
                      </Badge>
                    </div>
                    {channel.description ? (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {channel.description}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 mt-0.5 italic">
                        No description
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="text-muted-foreground/40 group-hover:text-primary/60 transition-smooth shrink-0 text-lg leading-none">
                    ›
                  </div>
                </button>
              ))
            ) : (
              <div
                data-ocid="channels.empty_state"
                className="flex flex-col items-center justify-center h-64 gap-4 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Radio size={28} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    No channels yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[220px]">
                    {isAdmin
                      ? "Create a channel to start broadcasting announcements"
                      : "Check back soon for official updates from GlintChat"}
                  </p>
                </div>
                {isAdmin && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setOpen(true)}
                    data-ocid="channels.empty_create_button"
                  >
                    <Plus size={14} />
                    Create First Channel
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
