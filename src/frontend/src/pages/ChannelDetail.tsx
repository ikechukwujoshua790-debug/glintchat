import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Megaphone, Radio, Send, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";
import {
  useChannelPosts,
  useChannels,
  useIsAdmin,
  usePostToChannel,
} from "../hooks/useBackend";

function formatTime(ts: bigint) {
  const date = new Date(Number(ts / BigInt(1000000)));
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChannelDetailPage() {
  const { channelId } = useParams({ strict: false }) as { channelId: string };
  const cid = BigInt(channelId);
  const { data: channels } = useChannels();
  const { data: posts, isLoading } = useChannelPosts(cid);
  const postToChannel = usePostToChannel();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const channel = channels?.find((c) => c.id === cid);

  const postsCount = posts?.length ?? 0;

  // Auto-scroll to bottom when new posts arrive
  useEffect(() => {
    if (postsCount > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [postsCount]);

  const handlePost = async () => {
    const msg = content.trim();
    if (!msg) return;
    setContent("");
    await postToChannel.mutateAsync({ channelId: cid, content: msg });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col h-full">
          {/* Channel header */}
          <div className="bg-card border-b border-border px-3 py-3 flex items-center gap-3 elevation-sm shrink-0">
            <button
              type="button"
              data-ocid="channel_detail.back_button"
              aria-label="Back to channels"
              onClick={() => navigate({ to: "/channels" })}
              className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-smooth shrink-0"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Radio size={17} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-semibold text-sm text-foreground truncate">
                  {channel?.name ?? "Channel"}
                </p>
                <Badge className="text-[10px] px-1.5 py-0 h-4 bg-accent/15 text-accent border-accent/25 hover:bg-accent/15 shrink-0">
                  Official
                </Badge>
              </div>
              {channel?.description && (
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {channel.description}
                </p>
              )}
            </div>

            {isAdmin && (
              <Badge className="text-[10px] px-2 py-1 h-5 bg-primary/15 text-primary border-primary/25 hover:bg-primary/15 shrink-0 gap-1">
                <ShieldCheck size={10} />
                Admin
              </Badge>
            )}
          </div>

          {/* Posts feed */}
          <div
            className="flex-1 overflow-y-auto bg-background"
            role="log"
            aria-live="polite"
          >
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-4 border border-border space-y-2"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="p-4 space-y-3">
                {/* Pinned info banner */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/8 border border-primary/15 text-xs text-primary/70">
                  <Megaphone size={12} />
                  <span>
                    Official announcements only. Only admins can post.
                  </span>
                </div>

                {posts.map((post, idx) => (
                  <div
                    key={post.id.toString()}
                    data-ocid={`channel_detail.post.${idx + 1}`}
                    className="bg-card border border-border rounded-xl p-4 transition-smooth hover:border-border/80"
                  >
                    {/* Post header: admin badge + timestamp */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-2 py-0.5">
                        <ShieldCheck size={11} className="text-primary" />
                        <span className="text-[11px] font-semibold text-primary">
                          GlintChat Admin
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
                        {formatTime(post.postedAt)}
                      </span>
                    </div>

                    {/* Post content */}
                    <p className="text-sm text-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            ) : (
              <div
                data-ocid="channel_detail.empty_state"
                className="flex flex-col items-center justify-center h-full min-h-[260px] gap-4 text-center px-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Megaphone size={28} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    No announcements yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isAdmin
                      ? "Post the first announcement to this channel"
                      : "Stay tuned for official updates"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Admin post composer */}
          {isAdmin ? (
            <div className="bg-card border-t border-border p-3 flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <ShieldCheck size={13} className="text-primary" />
              </div>
              <Input
                data-ocid="channel_detail.message_input"
                placeholder="Broadcast an announcement…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-secondary border-transparent focus:border-primary/40 h-9 text-sm"
              />
              <Button
                data-ocid="channel_detail.send_button"
                size="icon"
                onClick={handlePost}
                disabled={!content.trim() || postToChannel.isPending}
                aria-label="Send announcement"
                className="shrink-0 h-9 w-9"
              >
                <Send size={15} />
              </Button>
            </div>
          ) : (
            /* Read-only notice for regular users */
            <div className="bg-card border-t border-border px-4 py-2.5 flex items-center justify-center gap-2 shrink-0">
              <ShieldCheck size={13} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Read-only — only admins can post in official channels
              </span>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
