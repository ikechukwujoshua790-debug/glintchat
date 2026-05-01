import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "../components/Logo";

export function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0 elevation-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.history.back()}
          aria-label="Go back"
          data-ocid="privacy.back_button"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
        </Button>
        <Logo size={28} />
        <span className="font-display font-semibold text-foreground text-base">
          GlintChat
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Page title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Core privacy statement card */}
          <div
            className="bg-card border border-border rounded-2xl p-6 elevation-sm mb-6"
            data-ocid="privacy.statement_card"
          >
            <p className="text-foreground text-base leading-relaxed font-medium">
              GlintChat is private and secure. We do not track, sell, or analyze
              your data.
            </p>
          </div>

          {/* Supporting details */}
          <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p>
                Your messages are encrypted end-to-end and stored on the
                Internet Computer — a decentralized network with no single point
                of control.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p>
                Your real name and phone number are used solely to identify you
                to other users. They are never shared with advertisers or third
                parties.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p>
                Verification payments are processed via manual bank transfer.
                GlintChat does not store any card or payment information.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p>
                Status posts are automatically deleted after 24 hours and are
                never archived or analyzed.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
