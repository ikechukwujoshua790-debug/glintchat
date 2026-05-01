import { Link, useLocation } from "@tanstack/react-router";
import {
  Hash,
  MessageCircle,
  MoreHorizontal,
  Radio,
  Settings,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useIsAdmin } from "../hooks/useBackend";
import { LogoWithText } from "./Logo";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const NAV_ITEMS = [
  {
    label: "Chats",
    path: "/chats",
    icon: MessageCircle,
    ocid: "nav.chats_tab",
  },
  { label: "Groups", path: "/groups", icon: Users, ocid: "nav.groups_tab" },
  { label: "Status", path: "/status", icon: Radio, ocid: "nav.status_tab" },
  {
    label: "Channels",
    path: "/channels",
    icon: Hash,
    ocid: "nav.channels_tab",
  },
  { label: "More", path: "/more", icon: MoreHorizontal, ocid: "nav.more_tab" },
];

export function Layout({ children, showNav = true }: LayoutProps) {
  const location = useLocation();
  const { data: isAdmin } = useIsAdmin();

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Desktop layout */}
      <div className="hidden md:flex h-full">
        {/* Sidebar */}
        {showNav && (
          <aside className="w-16 flex flex-col items-center py-4 bg-card border-r border-border/50 gap-1 shrink-0">
            <Link to="/chats" className="mb-4" aria-label="GlintChat home">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="font-display font-bold text-primary text-sm">
                  G
                </span>
              </div>
            </Link>

            {NAV_ITEMS.map(({ label, path, icon: Icon, ocid }) => {
              const active = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  data-ocid={ocid}
                  className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-smooth group ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  title={label}
                >
                  <Icon size={18} />
                </Link>
              );
            })}

            <div className="flex-1" />

            {isAdmin === true && (
              <Link
                to="/admin"
                data-ocid="nav.admin_link"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth"
                title="Admin"
              >
                <Shield size={18} />
              </Link>
            )}
            <Link
              to="/more"
              data-ocid="nav.settings_link"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
            <Link
              to="/privacy"
              data-ocid="nav.privacy_link"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-smooth"
              title="Privacy Policy"
            >
              <ShieldCheck size={18} />
            </Link>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col h-full">
        {/* Mobile header */}
        <header className="bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between shrink-0 elevation-sm">
          <LogoWithText />
        </header>

        {/* Mobile content */}
        <main className="flex-1 overflow-hidden">{children}</main>

        {/* Mobile bottom nav */}
        {showNav && (
          <nav className="bg-card border-t border-border/50 flex items-center justify-around px-2 py-2 shrink-0 elevation-sm">
            {NAV_ITEMS.map(({ label, path, icon: Icon, ocid }) => {
              const active = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  data-ocid={ocid}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-smooth min-w-[44px] ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Branding footer */}
      <div className="hidden md:flex justify-center py-1.5 bg-card border-t border-border/30 shrink-0">
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          © {new Date().getFullYear()}. Built with love using caffeine.ai
        </a>
      </div>

      {/* Privacy Policy footer link — visible on desktop below sidebar */}
      <div
        className="hidden md:flex fixed bottom-2 left-0 w-16 justify-center"
        aria-label="Privacy Policy"
      >
        <Link
          to="/privacy"
          data-ocid="footer.privacy_link"
          className="text-[9px] text-muted-foreground hover:text-foreground transition-colors px-1 text-center leading-tight"
          title="Privacy Policy"
        >
          Privacy
        </Link>
      </div>
    </div>
  );
}
