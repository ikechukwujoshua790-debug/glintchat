import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useCallerProfile } from "../hooks/useBackend";

export function LoginPage() {
  const { login, isAuthenticated, isInitializing, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isFetched } = useCallerProfile();

  useEffect(() => {
    if (isAuthenticated && isFetched) {
      if (profile) {
        navigate({ to: "/chats" });
      } else {
        navigate({ to: "/signup" });
      }
    }
  }, [isAuthenticated, isFetched, profile, navigate]);

  return (
    <Layout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-full bg-background px-6 py-12">
        {/* Main card */}
        <div
          data-ocid="login.page"
          className="flex flex-col items-center gap-8 w-full max-w-sm"
        >
          {/* Logo + branding */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[20px] blur-xl scale-110" />
              <Logo size={80} className="relative" />
            </div>
            <div className="text-center space-y-1.5">
              <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
                GlintChat
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[260px]">
                Private, secure messaging.
                <br />
                No tracking. No data selling.
              </p>
            </div>
          </div>

          {/* Sign-in button */}
          <div className="w-full space-y-3">
            <Button
              data-ocid="login.sign_in_button"
              onClick={login}
              disabled={isInitializing || isLoggingIn}
              className="w-full h-12 font-semibold text-base"
              size="lg"
            >
              {isInitializing
                ? "Loading…"
                : isLoggingIn
                  ? "Opening login…"
                  : "Sign In with Internet Identity"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline focus-visible:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { icon: "🔒", label: "Private" },
              { icon: "✅", label: "Verified" },
              { icon: "💬", label: "Real-time" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
