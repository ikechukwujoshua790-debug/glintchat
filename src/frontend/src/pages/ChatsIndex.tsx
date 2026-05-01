import { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Edit,
  MessageSquarePlus,
  Phone,
  QrCode,
  Search,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { LogoWithText } from "../components/Logo";
import { QRScanner } from "../components/QRScanner";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import {
  useAdminUsers,
  useCallerProfile,
  useGetUserByPhone,
  useMyGroups,
} from "../hooks/useBackend";
import type { Group, UserProfile } from "../types";
import { SignupPage } from "./SignupPage";

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
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function GroupRow({
  group,
  index,
  onClick,
}: {
  group: Group;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`chats.group.item.${index}`}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-smooth text-left"
      style={{ borderBottom: "1px solid oklch(var(--border) / 0.2)" }}
    >
      <div className="relative shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
            {initials(group.name)}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm text-foreground truncate">
            {group.name}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0">
            {formatRelativeTime(group.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Users size={10} className="shrink-0" />
          {group.members.length} member{group.members.length !== 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
}

function DmRow({
  user,
  index,
  onClick,
}: {
  user: UserProfile;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`chats.dm.item.${index}`}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-smooth text-left"
      style={{ borderBottom: "1px solid oklch(var(--border) / 0.2)" }}
    >
      <Avatar className="w-12 h-12 shrink-0">
        <AvatarFallback className="bg-accent/20 text-accent font-semibold text-sm">
          {initials(user.realName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-foreground truncate">
            {user.realName}
          </span>
          {user.isVerified && (
            <CheckCircle2
              size={13}
              className="text-blue-400 shrink-0"
              aria-label="Verified"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          Tap to open conversation
        </p>
      </div>
    </button>
  );
}

function ContactPickerSheet({
  open,
  onClose,
  currentUserId,
  users,
  isLoading,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  currentUserId: string;
  users: UserProfile[];
  isLoading: boolean;
  onSelect: (userId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.id.toString() !== currentUserId &&
        (u.realName.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q)),
    );
  }, [users, currentUserId, query]);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        data-ocid="chats.contact_picker.sheet"
        className="rounded-t-2xl max-h-[80dvh] flex flex-col p-0"
      >
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-base">
              New Message
            </SheetTitle>
            <button
              type="button"
              data-ocid="chats.contact_picker.close_button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="relative mt-2">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              data-ocid="chats.contact_picker.search_input"
              placeholder="Search by name or phone…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9 bg-secondary border-transparent focus:border-primary/40 text-sm"
              autoFocus
            />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="chats.contact_picker.empty_state"
              className="flex flex-col items-center justify-center py-16 px-6 gap-3"
            >
              <p className="text-sm font-semibold text-foreground">
                {query ? "No users found" : "No other users yet"}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                {query
                  ? "Try a different name or phone number"
                  : "Invite friends to join GlintChat"}
              </p>
            </div>
          ) : (
            filtered.map((user, idx) => (
              <button
                key={user.id.toString()}
                type="button"
                data-ocid={`chats.contact_picker.item.${idx + 1}`}
                onClick={() => {
                  onSelect(user.id.toString());
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 active:bg-secondary/60 transition-smooth text-left"
                style={{
                  borderBottom: "1px solid oklch(var(--border) / 0.15)",
                }}
              >
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                    {initials(user.realName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {user.realName}
                    </span>
                    {user.isVerified && (
                      <CheckCircle2
                        size={12}
                        className="text-blue-400 shrink-0"
                        aria-label="Verified"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.phone}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NewContactSheet({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (userId: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<"idle" | "not_found">("idle");
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

  return (
    <Sheet open={open} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent
        side="bottom"
        data-ocid="chats.new_contact.sheet"
        className="rounded-t-2xl p-0"
      >
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border/30">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-base flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              New Contact
            </SheetTitle>
            <button
              type="button"
              data-ocid="chats.new_contact.close_button"
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-left">
            Enter a phone number to find a GlintChat user
          </p>
        </SheetHeader>

        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              data-ocid="chats.new_contact.phone_input"
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setResult("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-secondary border-transparent focus:border-primary/40 text-sm"
              type="tel"
              autoFocus
            />
            <Button
              data-ocid="chats.new_contact.search_button"
              onClick={handleSearch}
              disabled={!phone.trim() || getUserByPhone.isPending}
              className="shrink-0"
              size="sm"
            >
              {getUserByPhone.isPending ? "Searching…" : "Find"}
            </Button>
          </div>

          {result === "not_found" && (
            <div
              data-ocid="chats.new_contact.not_found_state"
              className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
            >
              <span className="text-sm text-muted-foreground">
                No GlintChat user found with that number.
              </span>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ChatsIndexPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const {
    data: profile,
    isLoading: profileLoading,
    isFetched,
  } = useCallerProfile();
  const { data: groups, isLoading: groupsLoading } = useMyGroups();
  const { data: allUsers, isLoading: usersLoading } = useAdminUsers();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && profile === null;

  const currentUserId = profile?.id.toString() ?? "";

  const filteredGroups =
    groups?.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const filteredDms = useMemo(() => {
    const q = search.toLowerCase();
    return (allUsers ?? []).filter(
      (u) =>
        u.id.toString() !== currentUserId &&
        (u.realName.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q)),
    );
  }, [allUsers, currentUserId, search]);

  const isEmpty = filteredGroups.length === 0 && filteredDms.length === 0;

  const handleQRScan = (raw: string) => {
    setScannerOpen(false);
    // Parse glintchat://profile/{userId} or profile/{userId}
    let userId = raw;
    if (raw.startsWith("glintchat://profile/")) {
      userId = raw.replace("glintchat://profile/", "");
    } else if (raw.startsWith("profile/")) {
      userId = raw.replace("profile/", "");
    }
    // Validate it's a principal-like string
    try {
      Principal.fromText(userId);
      navigate({ to: "/chats/$userId", params: { userId } });
    } catch {
      toast.error("Invalid QR code. Please scan a GlintChat profile code.");
    }
  };

  if (isInitializing || (!isFetched && isAuthenticated)) {
    return (
      <Layout>
        <div className="flex flex-col h-full bg-card">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 px-1">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (showProfileSetup) return <SignupPage />;

  return (
    <AuthGuard>
      <Layout>
        <div className="flex h-full">
          {/* Conversation sidebar */}
          <div
            className="w-full md:w-80 lg:w-96 flex flex-col bg-card"
            style={{ borderRight: "1px solid oklch(var(--border) / 0.4)" }}
          >
            {/* Header */}
            <div
              className="px-4 pt-4 pb-3"
              style={{ borderBottom: "1px solid oklch(var(--border) / 0.4)" }}
            >
              <div className="hidden md:block mb-3">
                <LogoWithText />
              </div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-lg text-foreground tracking-tight">
                  Conversations
                </h2>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    data-ocid="chats.scan_code_button"
                    onClick={() => setScannerOpen(true)}
                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center"
                    aria-label="Scan QR code"
                  >
                    <QrCode size={15} />
                  </button>
                  <button
                    type="button"
                    data-ocid="chats.new_contact_button"
                    onClick={() => setNewContactOpen(true)}
                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center"
                    aria-label="Add contact by phone"
                  >
                    <Phone size={15} />
                  </button>
                  <button
                    type="button"
                    data-ocid="chats.new_group_button"
                    onClick={() => navigate({ to: "/groups" })}
                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center"
                    aria-label="View groups"
                  >
                    <Users size={15} />
                  </button>
                  <button
                    type="button"
                    data-ocid="chats.new_chat_button"
                    onClick={() => setPickerOpen(true)}
                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-smooth flex items-center justify-center"
                    aria-label="New chat"
                  >
                    <Edit size={15} />
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  data-ocid="chats.search_input"
                  placeholder="Search conversations…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-secondary border-transparent focus:border-primary/40 text-sm"
                />
              </div>
            </div>

            {/* My profile bar */}
            {profile && (
              <div
                className="px-4 py-2.5 flex items-center gap-3 bg-secondary/20"
                style={{
                  borderBottom: "1px solid oklch(var(--border) / 0.25)",
                }}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-primary/25 text-primary text-xs font-bold">
                    {initials(profile.realName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-foreground truncate">
                      {profile.realName}
                    </span>
                    {profile.isVerified && (
                      <CheckCircle2
                        size={13}
                        className="text-blue-400 shrink-0"
                        aria-label="Verified"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-primary font-medium">
                    ● Online
                  </span>
                </div>
              </div>
            )}

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {groupsLoading || usersLoading ? (
                <div className="p-4 space-y-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-1 py-2">
                      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEmpty ? (
                <div
                  data-ocid="chats.empty_state"
                  className="flex flex-col items-center justify-center py-20 px-6 gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <MessageSquarePlus size={26} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm text-foreground">
                      {search ? "No results found" : "No conversations yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {search
                        ? "Try a different search term"
                        : "Start a new chat or join a group"}
                    </p>
                  </div>
                  {!search && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-ocid="chats.start_chat_button"
                        onClick={() => setPickerOpen(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-smooth"
                      >
                        Start a Chat
                      </button>
                      <button
                        type="button"
                        data-ocid="chats.add_by_phone_button"
                        onClick={() => setNewContactOpen(true)}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg text-xs font-semibold hover:bg-secondary/70 transition-smooth flex items-center gap-1.5"
                      >
                        <Phone size={12} />
                        By Phone
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Groups section */}
                  {filteredGroups.length > 0 && (
                    <>
                      <div
                        className="px-4 py-2 bg-secondary/30"
                        style={{
                          borderBottom: "1px solid oklch(var(--border) / 0.2)",
                        }}
                      >
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                          Groups
                        </span>
                      </div>
                      {filteredGroups.map((group, idx) => (
                        <GroupRow
                          key={group.id.toString()}
                          group={group}
                          index={idx + 1}
                          onClick={() =>
                            navigate({
                              to: "/groups/$groupId",
                              params: { groupId: group.id.toString() },
                            })
                          }
                        />
                      ))}
                    </>
                  )}

                  {/* Direct Messages section */}
                  {filteredDms.length > 0 && (
                    <>
                      <div
                        className="px-4 py-2 bg-secondary/30"
                        style={{
                          borderBottom: "1px solid oklch(var(--border) / 0.2)",
                        }}
                      >
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                          Direct Messages
                        </span>
                      </div>
                      {filteredDms.map((user, idx) => (
                        <DmRow
                          key={user.id.toString()}
                          user={user}
                          index={idx + 1}
                          onClick={() =>
                            navigate({
                              to: "/chats/$userId",
                              params: { userId: user.id.toString() },
                            })
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop empty state — thread area */}
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-background gap-5">
            <div
              className="w-20 h-20 rounded-3xl bg-card border flex items-center justify-center elevation-sm"
              style={{ borderColor: "oklch(var(--border) / 0.5)" }}
            >
              <MessageSquarePlus size={36} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-foreground">
                Select a conversation
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Choose a chat or group from the list to start messaging
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-accent border-accent/30 bg-accent/5 text-xs"
            >
              GlintChat — Private & Secure
            </Badge>
          </div>
        </div>

        {/* New Chat — contact picker sheet */}
        <ContactPickerSheet
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          currentUserId={currentUserId}
          users={allUsers ?? []}
          isLoading={usersLoading}
          onSelect={(userId) =>
            navigate({ to: "/chats/$userId", params: { userId } })
          }
        />

        {/* New Contact — by phone number */}
        <NewContactSheet
          open={newContactOpen}
          onClose={() => setNewContactOpen(false)}
          onNavigate={(userId) =>
            navigate({ to: "/chats/$userId", params: { userId } })
          }
        />

        {/* QR Scanner */}
        {scannerOpen && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </Layout>
    </AuthGuard>
  );
}
