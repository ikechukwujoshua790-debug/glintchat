import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Logo } from "./index-DFLYPydE.js";
import { u as useCallerProfile, L as Layout } from "./Layout-81mP_Nwv.js";
import { B as Button } from "./button-CQxG3T_J.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
function LoginPage() {
  const { login, isAuthenticated, isInitializing, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isFetched } = useCallerProfile();
  reactExports.useEffect(() => {
    if (isAuthenticated && isFetched) {
      if (profile) {
        navigate({ to: "/chats" });
      } else {
        navigate({ to: "/signup" });
      }
    }
  }, [isAuthenticated, isFetched, profile, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-full bg-background px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "login.page",
      className: "flex flex-col items-center gap-8 w-full max-w-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/20 rounded-[20px] blur-xl scale-110" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 80, className: "relative" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight", children: "GlintChat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm leading-relaxed max-w-[260px]", children: [
              "Private, secure messaging.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "No tracking. No data selling."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "login.sign_in_button",
              onClick: login,
              disabled: isInitializing || isLoggingIn,
              className: "w-full h-12 font-semibold text-base",
              size: "lg",
              children: isInitializing ? "Loading…" : isLoggingIn ? "Opening login…" : "Sign In with Internet Identity"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
            "By signing in, you agree to our",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/privacy",
                className: "text-primary hover:underline focus-visible:underline",
                children: "Privacy Policy"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 w-full", children: [
          { icon: "🔒", label: "Private" },
          { icon: "✅", label: "Verified" },
          { icon: "💬", label: "Real-time" }
        ].map(({ icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: label })
            ]
          },
          label
        )) })
      ]
    }
  ) }) });
}
export {
  LoginPage
};
