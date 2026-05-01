import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Logo } from "./index-DFLYPydE.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
import { v as useIsAdmin } from "./Layout-81mP_Nwv.js";
import { B as Button } from "./button-CQxG3T_J.js";
function AuthGuard({ children, requireAdmin = false }) {
  const { isAuthenticated, isInitializing, login } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  reactExports.useEffect(() => {
    if (requireAdmin && !adminLoading && isAdmin === false) {
      navigate({ to: "/chats" });
    }
  }, [requireAdmin, isAdmin, adminLoading, navigate]);
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-background gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "w-2 h-2 rounded-full bg-primary animate-bounce",
          style: { animationDelay: `${i * 0.15}s` }
        },
        i
      )) })
    ] });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-background gap-6 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 64 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Welcome to GlintChat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-xs", children: "Sign in to continue to your private, secure messaging space." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "auth_guard.login_button",
          onClick: login,
          className: "w-full max-w-xs",
          size: "lg",
          children: "Sign In with Internet Identity"
        }
      )
    ] });
  }
  if (requireAdmin) {
    if (adminLoading || isAdmin === void 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-background gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 40 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-2 h-2 rounded-full bg-primary animate-bounce",
            style: { animationDelay: `${i * 0.15}s` }
          },
          i
        )) })
      ] });
    }
    if (!isAdmin) return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  AuthGuard as A
};
