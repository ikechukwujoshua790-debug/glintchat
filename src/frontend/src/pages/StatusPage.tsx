import { BadgeCheck, Clock, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../hooks/useAuth";
import {
  useActiveStatusPosts,
  useCallerProfile,
  useCreateStatusPost,
  useDeleteStatusPost,
  useUserProfile,
} from "../hooks/useBackend";
import type { StatusPost, UserProfile } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function msLeft(expiresAt: bigint): number {
  const exp = Number(expiresAt / BigInt(1_000_000));
  return exp - Date.now();
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Expired";
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}

function formatPostedAt(createdAt: bigint): string {
  const ts = Number(createdAt / BigInt(1_000_000));
  const date = new Date(ts);
  const now = Date.now();
  const diff = now - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Urgency color based on time remaining
function countdownClass(ms: number): string {
  if (ms <= 0) return "text-destructive";
  if (ms < 3_600_000) return "text-destructive/80"; // < 1h
  if (ms < 6 * 3_600_000) return "text-accent"; // < 6h
  return "text-muted-foreground";
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(expiresAt: bigint): number {
  const [ms, setMs] = useState(() => msLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setMs(msLeft(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return ms;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusAuthor({ authorId }: { authorId: { toString(): string } }) {
  const { data: profile } = useUserProfile(
    authorId as Parameters<typeof useUserProfile>[0],
  );

  if (!profile) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="font-semibold text-sm text-foreground leading-tight">
        {profile.realName}
      </span>
      {profile.isVerified && (
        <BadgeCheck
          size={14}
          className="text-accent shrink-0"
          aria-label="Verified"
        />
      )}
    </div>
  );
}

function StatusAvatar({
  authorId,
  profile,
}: { authorId: { toString(): string }; profile?: UserProfile | null }) {
  const initials = profile?.realName
    ? getInitials(profile.realName)
    : authorId.toString().slice(0, 2).toUpperCase();
  return (
    <Avatar className="w-11 h-11 shrink-0 ring-2 ring-primary/20">
      <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function StatusCountdown({ expiresAt }: { expiresAt: bigint }) {
  const remaining = useCountdown(expiresAt);
  const progress = Math.max(0, Math.min(1, remaining / (24 * 3_600_000)));
  const circumference = 2 * Math.PI * 10;
  const strokeDash = circumference * progress;

  return (
    <div className="flex items-center gap-1.5">
      {/* Mini circular progress */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="shrink-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-border opacity-40"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          className={
            remaining < 3_600_000
              ? "text-destructive"
              : remaining < 6 * 3_600_000
                ? "text-accent"
                : "text-primary"
          }
        />
      </svg>
      <span
        className={`text-xs font-medium tabular-nums ${countdownClass(remaining)}`}
      >
        {formatCountdown(remaining)}
      </span>
    </div>
  );
}

function StatusCard({
  post,
  isMine,
  idx,
  onDelete,
  isDeleting,
}: {
  post: StatusPost;
  isMine: boolean;
  idx: number;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const { data: profile } = useUserProfile(
    post.authorId as Parameters<typeof useUserProfile>[0],
  );

  return (
    <div
      data-ocid={`status.item.${idx}`}
      className="status-card p-4 group transition-smooth hover:elevation-sm"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <StatusAvatar authorId={post.authorId} profile={profile} />
          <div className="min-w-0 flex-1">
            <StatusAuthor authorId={post.authorId} />
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {formatPostedAt(post.createdAt)}
              </span>
              <span className="text-border/60 text-xs">·</span>
              <StatusCountdown expiresAt={post.expiresAt} />
            </div>
          </div>
        </div>

        {isMine && (
          <button
            type="button"
            data-ocid={`status.delete_button.${idx}`}
            onClick={onDelete}
            disabled={isDeleting}
            className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 disabled:opacity-50"
            aria-label="Delete status"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-foreground mt-3 leading-relaxed break-words">
        {post.content}
      </p>

      {/* Footer accent line for "mine" posts */}
      {isMine && (
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Your post</span>
        </div>
      )}
    </div>
  );
}

function PostSkeletons() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="status-card p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function StatusPage() {
  const { identity } = useAuth();
  const { data: callerProfile } = useCallerProfile();
  const {
    data: posts,
    isLoading,
    refetch,
    dataUpdatedAt,
  } = useActiveStatusPosts();
  const createPost = useCreateStatusPost();
  const deletePost = useDeleteStatusPost();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30_000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createPost.mutateAsync(content.trim());
    setContent("");
    setOpen(false);
  };

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col h-full bg-background">
          {/* Page header */}
          <div className="bg-card border-b px-4 py-4 flex items-center justify-between shrink-0 elevation-sm">
            <div className="flex items-center gap-3">
              {callerProfile && (
                <Avatar className="w-9 h-9 ring-2 ring-primary/30">
                  <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
                    {getInitials(callerProfile.realName)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-semibold text-lg text-foreground leading-tight">
                    Status
                  </h1>
                  {posts && posts.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold tabular-nums">
                      {posts.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock size={10} />
                  Posts auto-expire in 24 hours
                  {lastUpdated && (
                    <span className="text-border/70 ml-1">· {lastUpdated}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-ocid="status.refresh_button"
                onClick={() => refetch()}
                className="w-8 h-8 rounded-lg hover:bg-muted transition-smooth flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Refresh feed"
              >
                <RefreshCw size={14} />
              </button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    data-ocid="status.new_post_button"
                    size="sm"
                    className="gap-1.5 font-semibold"
                  >
                    <Plus size={15} />
                    Post
                  </Button>
                </DialogTrigger>
                <DialogContent data-ocid="status.dialog">
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      Share a Status
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreate} className="space-y-4 pt-1">
                    <div className="space-y-2">
                      <Label htmlFor="statusContent">
                        What's on your mind?
                      </Label>
                      <Textarea
                        id="statusContent"
                        data-ocid="status.content_input"
                        placeholder="Share something with your contacts…"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        maxLength={500}
                        required
                        className="resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={11} />
                          Disappears after 24 hours
                        </p>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {content.length}/500
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        data-ocid="status.cancel_button"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOpen(false);
                          setContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        data-ocid="status.submit_button"
                        type="submit"
                        disabled={createPost.isPending || !content.trim()}
                      >
                        {createPost.isPending ? "Posting…" : "Post Status"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Feed */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-4 space-y-3">
              {isLoading ? (
                <PostSkeletons />
              ) : posts && posts.length > 0 ? (
                <>
                  {/* My post first if exists */}
                  {posts
                    .slice()
                    .sort((a, b) => {
                      const aMine =
                        a.authorId.toString() === myPrincipal ? -1 : 0;
                      const bMine =
                        b.authorId.toString() === myPrincipal ? -1 : 0;
                      if (aMine !== bMine) return aMine - bMine;
                      return Number(b.createdAt - a.createdAt);
                    })
                    .map((post, idx) => {
                      const isMine = post.authorId.toString() === myPrincipal;
                      return (
                        <StatusCard
                          key={post.id.toString()}
                          post={post}
                          isMine={isMine}
                          idx={idx + 1}
                          onDelete={() => deletePost.mutate(post.id)}
                          isDeleting={deletePost.isPending}
                        />
                      );
                    })}
                </>
              ) : (
                <div
                  data-ocid="status.empty_state"
                  className="flex flex-col items-center justify-center py-24 gap-5"
                >
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center elevation-sm">
                    <Clock size={32} className="text-primary" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-display font-semibold text-foreground text-lg">
                      No status updates yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Be the first to share a 24-hour status with your contacts
                    </p>
                  </div>
                  <Button
                    data-ocid="status.empty_post_button"
                    onClick={() => setOpen(true)}
                    className="gap-2"
                  >
                    <Plus size={15} />
                    Post a Status
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
