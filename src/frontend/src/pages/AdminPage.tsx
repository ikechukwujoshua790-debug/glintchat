import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Loader2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Logo } from "../components/Logo";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  useAdminApproveVerification,
  useAdminPayoutRequests,
  useAdminRejectVerification,
  useAdminRequestPayout,
  useAdminTotalRevenue,
  useAdminUsers,
  useAdminVerificationRequests,
  useGetMediaDownloadUrl,
  useIsAdmin,
} from "../hooks/useBackend";
import { PayoutStatus, VerificationStatus } from "../types";
import type { VerificationRequest } from "../types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts / BigInt(1_000_000))).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Revenue stat card ───────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  loading?: boolean;
  ocid: string;
}

function StatCard({
  label,
  value,
  icon,
  accent,
  loading,
  ocid,
}: StatCardProps) {
  return (
    <div
      data-ocid={ocid}
      className="bg-card border border-border rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {icon}
        {label}
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p
          className={`font-display text-2xl font-bold ${accent ? "text-accent" : "text-foreground"}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

// ─── Verification request row ─────────────────────────────────────────────────

function VerificationRow({
  request,
  index,
}: {
  request: VerificationRequest;
  index: number;
}) {
  const approve = useAdminApproveVerification();
  const reject = useAdminRejectVerification();
  const getDownloadUrl = useGetMediaDownloadUrl();

  const handleViewReceipt = async () => {
    try {
      const url = await getDownloadUrl.mutateAsync(request.receiptStorageKey);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // silently fail
    }
  };

  const statusColors: Record<string, string> = {
    [VerificationStatus.pending]:
      "bg-amber-500/15 text-amber-400 border-amber-400/30",
    [VerificationStatus.approved]:
      "bg-blue-500/15 text-blue-400 border-blue-400/30",
    [VerificationStatus.rejected]:
      "bg-destructive/15 text-destructive border-destructive/30",
  };

  const isPending = request.status === VerificationStatus.pending;

  return (
    <div
      data-ocid={`admin.verification.${index + 1}`}
      className="bg-card border border-border rounded-xl p-3 space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
          <BadgeCheck size={16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-mono truncate">
            {request.userId.toString().slice(0, 26)}…
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submitted {formatDate(request.submittedAt)}
          </p>
        </div>
        <Badge
          className={`text-[10px] shrink-0 ${statusColors[request.status] ?? ""}`}
        >
          {request.status === VerificationStatus.pending
            ? "Pending"
            : request.status === VerificationStatus.approved
              ? "Approved"
              : "Rejected"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs gap-1.5"
          onClick={handleViewReceipt}
          disabled={getDownloadUrl.isPending}
          data-ocid={`admin.view_receipt_button.${index + 1}`}
        >
          {getDownloadUrl.isPending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <ExternalLink size={11} />
          )}
          View Receipt
        </Button>

        {isPending && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs gap-1.5 bg-blue-500/20 text-blue-400 border-blue-400/30 hover:bg-blue-500/30"
              onClick={() => approve.mutate(request.userId)}
              disabled={approve.isPending || reject.isPending}
              data-ocid={`admin.approve_button.${index + 1}`}
            >
              {approve.isPending ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <CheckCircle2 size={11} />
              )}
              Verify User
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => reject.mutate(request.userId)}
              disabled={approve.isPending || reject.isPending}
              data-ocid={`admin.reject_button.${index + 1}`}
            >
              {reject.isPending ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function AdminPage() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const { data: totalRevenue, isLoading: revLoading } = useAdminTotalRevenue();
  const { data: verificationRequests, isLoading: verLoading } =
    useAdminVerificationRequests();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: payouts, isLoading: payoutsLoading } = useAdminPayoutRequests();
  const requestPayout = useAdminRequestPayout();

  const [payoutConfirmed, setPayoutConfirmed] = useState(false);

  // Redirect non-admins to /chats
  useEffect(() => {
    if (!adminLoading && isAdmin === false) {
      navigate({ to: "/chats" });
    }
  }, [isAdmin, adminLoading, navigate]);

  // Loading — waiting for admin check
  if (adminLoading || isAdmin === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Logo size={40} />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Non-admin: render nothing while redirect happens
  if (isAdmin !== true) return null;

  const revenueUsd =
    totalRevenue !== undefined ? Number(totalRevenue) / 100 : 0;

  const approvedCount =
    verificationRequests?.filter(
      (v) => v.status === VerificationStatus.approved,
    ).length ?? 0;

  const pendingCount =
    verificationRequests?.filter((v) => v.status === VerificationStatus.pending)
      .length ?? 0;

  const handleRequestPayout = async () => {
    await requestPayout.mutateAsync();
    setPayoutConfirmed(true);
    setTimeout(() => setPayoutConfirmed(false), 4000);
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="font-display font-semibold text-lg text-foreground leading-tight">
                Earnings Dashboard
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                Admin access only
              </p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30 text-xs">
                {pendingCount} pending
              </Badge>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              ocid="admin.revenue_card"
              label="Total Revenue"
              value={`$${revenueUsd.toFixed(2)}`}
              icon={<DollarSign size={12} />}
              accent
              loading={revLoading}
            />
            <StatCard
              ocid="admin.verified_count_card"
              label="Verified Users"
              value={String(approvedCount)}
              icon={<BadgeCheck size={12} />}
              loading={verLoading}
            />
          </div>

          {/* Avg per user indicator */}
          {!revLoading && !verLoading && approvedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/8 border border-primary/20 rounded-lg text-xs text-primary">
              <TrendingUp size={13} />
              <span>
                Avg. ${(revenueUsd / approvedCount).toFixed(2)} per verification
              </span>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="verifications" data-ocid="admin.tabs">
            <TabsList className="w-full">
              <TabsTrigger
                value="verifications"
                data-ocid="admin.verifications_tab"
                className="flex-1 text-xs"
              >
                Verifications
                {!verLoading && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="users"
                data-ocid="admin.users_tab"
                className="flex-1 text-xs"
              >
                All Users
                {!usersLoading && users && users.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
                    {users.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="payouts"
                data-ocid="admin.payouts_tab"
                className="flex-1 text-xs"
              >
                Payouts
              </TabsTrigger>
            </TabsList>

            {/* ── Verifications ─────────────────────────────────── */}
            <TabsContent value="verifications" className="mt-4 space-y-2">
              {verLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
                  ))}
                </div>
              ) : verificationRequests && verificationRequests.length > 0 ? (
                verificationRequests.map((v, idx) => (
                  <VerificationRow
                    key={v.userId.toString()}
                    request={v}
                    index={idx}
                  />
                ))
              ) : (
                <div
                  data-ocid="admin.verifications_empty"
                  className="flex flex-col items-center gap-2 py-14 text-center"
                >
                  <BadgeCheck
                    size={32}
                    className="text-muted-foreground opacity-40"
                  />
                  <p className="text-sm text-muted-foreground">
                    No verification requests yet
                  </p>
                  <p className="text-xs text-muted-foreground opacity-60">
                    Submitted receipts will appear here
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ── All Users ──────────────────────────────────────── */}
            <TabsContent value="users" className="mt-4 space-y-2">
              {usersLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[60px] w-full rounded-xl" />
                  ))}
                </div>
              ) : users && users.length > 0 ? (
                users.map((user, idx) => (
                  <div
                    key={user.id.toString()}
                    data-ocid={`admin.user.${idx + 1}`}
                    className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 transition-smooth"
                  >
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                        {initials(user.realName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.realName}
                        </p>
                        {user.isVerified && (
                          <BadgeCheck
                            size={14}
                            className="text-blue-400 shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {user.phone}
                      </p>
                    </div>
                    {user.isVerified && (
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-400/25 text-[10px] shrink-0">
                        Verified
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div
                  data-ocid="admin.users_empty"
                  className="flex flex-col items-center gap-2 py-14 text-center"
                >
                  <Users
                    size={32}
                    className="text-muted-foreground opacity-40"
                  />
                  <p className="text-sm text-muted-foreground">No users yet</p>
                </div>
              )}
            </TabsContent>

            {/* ── Payouts ────────────────────────────────────────── */}
            <TabsContent value="payouts" className="mt-4 space-y-4">
              {/* Request payout CTA */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Request Payout
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Available balance:{" "}
                    <span
                      className={
                        revenueUsd > 0 ? "text-accent font-semibold" : ""
                      }
                    >
                      ${revenueUsd.toFixed(2)}
                    </span>
                  </p>
                </div>

                {payoutConfirmed && (
                  <div
                    data-ocid="admin.payout_success_state"
                    className="flex items-center gap-2 text-xs text-primary bg-primary/8 border border-primary/20 rounded-lg px-3 py-2"
                  >
                    <BadgeCheck size={13} />
                    Payout request submitted successfully
                  </div>
                )}

                {revenueUsd === 0 && !payoutConfirmed && (
                  <div
                    data-ocid="admin.payout_empty_warning"
                    className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border rounded-lg px-3 py-2"
                  >
                    <AlertTriangle size={13} />
                    No revenue available to payout
                  </div>
                )}

                <Button
                  data-ocid="admin.request_payout_button"
                  onClick={handleRequestPayout}
                  disabled={requestPayout.isPending || revenueUsd === 0}
                  className="w-full gap-2"
                >
                  <DollarSign size={15} />
                  {requestPayout.isPending ? "Submitting…" : "Request Payout"}
                </Button>
              </div>

              {/* Payout history */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-1">
                  Payout History
                </p>
                {payoutsLoading ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-[60px] w-full rounded-xl"
                      />
                    ))}
                  </div>
                ) : payouts && payouts.length > 0 ? (
                  payouts.map((payout, idx) => (
                    <div
                      key={payout.id.toString()}
                      data-ocid={`admin.payout.${idx + 1}`}
                      className="bg-card border border-border rounded-xl p-3 flex items-center justify-between gap-3 mb-2 last:mb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          ${(Number(payout.totalAmount) / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(payout.requestedAt)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          payout.status === PayoutStatus.processed
                            ? "border-primary/40 text-primary bg-primary/8 text-[10px]"
                            : "border-accent/40 text-accent bg-accent/8 text-[10px]"
                        }
                      >
                        {payout.status === PayoutStatus.processed
                          ? "Processed"
                          : "Pending"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div
                    data-ocid="admin.payouts_empty"
                    className="flex flex-col items-center gap-2 py-10 text-center"
                  >
                    <DollarSign
                      size={28}
                      className="text-muted-foreground opacity-40"
                    />
                    <p className="text-sm text-muted-foreground">
                      No payout requests yet
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
