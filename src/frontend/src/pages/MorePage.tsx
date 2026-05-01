import { useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronRight,
  Lock,
  QrCode,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { QRCodeDisplay } from "../components/QRCodeDisplay";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import { useCallerProfile, useIsAdmin } from "../hooks/useBackend";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type MenuItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  ocid: string;
  variant?: "default" | "highlight" | "admin";
};

const menuItems: MenuItem[] = [
  {
    label: "Get Verified",
    icon: ShieldCheck,
    path: "/verify",
    ocid: "more.verify_link",
    variant: "highlight",
  },
  {
    label: "Privacy Policy",
    icon: Lock,
    path: "/privacy",
    ocid: "more.privacy_link",
  },
];

const adminMenuItem: MenuItem = {
  label: "Admin Dashboard",
  icon: Shield,
  path: "/admin",
  ocid: "more.admin_link",
  variant: "admin",
};

export function MorePage() {
  const { logout, isAuthenticated } = useAuth();
  const { data: profile, isLoading } = useCallerProfile();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const qrValue = profile ? `glintchat://profile/${profile.id.toString()}` : "";

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col h-full bg-background">
          {/* Header */}
          <div className="bg-card border-b border-border px-4 py-4 shrink-0">
            <h1 className="font-display font-semibold text-xl text-foreground">
              More
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Profile card */}
            <div
              data-ocid="more.profile_card"
              className="bg-card border border-border rounded-2xl p-4"
            >
              {isLoading ? (
                <div
                  data-ocid="more.loading_state"
                  className="flex items-center gap-4"
                >
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ) : profile ? (
                <div className="flex items-center gap-4">
                  {/* Avatar with online indicator */}
                  <div className="relative shrink-0">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                        {initials(profile.realName)}
                      </AvatarFallback>
                    </Avatar>
                    {profile.isVerified && (
                      <span
                        className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5"
                        title="Verified"
                      >
                        <BadgeCheck
                          size={18}
                          className="text-blue-400 fill-blue-400/20"
                          aria-label="Verified account"
                        />
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="font-display font-bold text-lg text-foreground truncate">
                        {profile.realName}
                      </h2>
                      {profile.isVerified && (
                        <BadgeCheck
                          size={16}
                          className="text-blue-400 shrink-0"
                          aria-label="Verified"
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {profile.phone}
                    </p>

                    {profile.isVerified ? (
                      <div className="badge-verified mt-1.5">
                        <ShieldCheck size={11} />
                        Verified
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-ocid="more.get_verified_button"
                        onClick={() => navigate({ to: "/verify" })}
                        className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 hover:underline mt-1.5 transition-colors"
                        aria-label="Get verified for $6"
                      >
                        Get Verified for $6
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* My QR Code */}
            {profile && (
              <div
                data-ocid="more.qr_code_section"
                className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 self-stretch">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <QrCode size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      My QR Code
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Others can scan this to add you on GlintChat
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-xl overflow-hidden p-2 bg-white"
                  aria-label="Your GlintChat QR code"
                >
                  <QRCodeDisplay
                    value={qrValue}
                    size={180}
                    className="block rounded"
                  />
                </div>

                <p className="text-[11px] text-muted-foreground text-center leading-relaxed max-w-[220px]">
                  Share this code so contacts can find you instantly on
                  GlintChat
                </p>
              </div>
            )}

            {/* Menu items */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {[...menuItems, ...(isAdmin === true ? [adminMenuItem] : [])].map(
                (item, idx) => {
                  const Icon = item.icon;
                  const isHighlight = item.variant === "highlight";
                  const isAdminItem = item.variant === "admin";
                  return (
                    <div key={item.label}>
                      {idx > 0 && <Separator />}
                      <button
                        type="button"
                        data-ocid={item.ocid}
                        onClick={() => navigate({ to: item.path as "/" })}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-smooth text-left"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isHighlight
                              ? "bg-blue-500/15"
                              : isAdminItem
                                ? "bg-accent/15"
                                : "bg-secondary"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isHighlight
                                ? "text-blue-400"
                                : isAdminItem
                                  ? "text-accent"
                                  : "text-muted-foreground"
                            }
                          />
                        </div>
                        <span
                          className={`flex-1 text-sm font-medium min-w-0 ${
                            isHighlight
                              ? "text-blue-400"
                              : isAdminItem
                                ? "text-accent"
                                : "text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                        <ChevronRight
                          size={16}
                          className="text-muted-foreground shrink-0"
                        />
                      </button>
                    </div>
                  );
                },
              )}
            </div>

            {/* Logout */}
            {isAuthenticated && (
              <button
                type="button"
                data-ocid="more.logout_button"
                onClick={logout}
                className="w-full px-4 py-3 bg-card border border-border rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth text-left"
              >
                Sign Out
              </button>
            )}

            {/* Branding */}
            <div className="text-center py-4">
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                © {new Date().getFullYear()}. Built with love using caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
}
