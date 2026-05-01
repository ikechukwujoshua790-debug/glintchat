import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useIsAdmin } from "../hooks/useBackend";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Redirect non-admins away from admin-only routes
  useEffect(() => {
    if (requireAdmin && !adminLoading && isAdmin === false) {
      navigate({ to: "/chats" });
    }
  }, [requireAdmin, isAdmin, adminLoading, navigate]);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
        <Logo size={48} />
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-6 p-6">
        <Logo size={64} />
        <h1 className="font-display text-2xl font-bold text-foreground">
          Welcome to GlintChat
        </h1>
        <p className="text-muted-foreground text-center max-w-xs">
          Sign in to continue to your private, secure messaging space.
        </p>
        <Button
          data-ocid="auth_guard.login_button"
          onClick={login}
          className="w-full max-w-xs"
          size="lg"
        >
          Sign In with Internet Identity
        </Button>
      </div>
    );
  }

  // Admin check: show loading spinner while backend resolves, then render nothing while redirect fires
  if (requireAdmin) {
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
    // Non-admin: render nothing while the redirect effect fires
    if (!isAdmin) return null;
  }

  return <>{children}</>;
}
