import { f as useRouter, j as jsxRuntimeExports, L as Logo } from "./index-DFLYPydE.js";
import { B as Button, S as ShieldCheck } from "./button-CQxG3T_J.js";
import { A as ArrowLeft } from "./arrow-left-BN3M1AU1.js";
function PrivacyPage() {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0 elevation-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => router.history.back(),
          "aria-label": "Go back",
          "data-ocid": "privacy.back_button",
          className: "text-muted-foreground hover:text-foreground transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 28 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground text-base", children: "GlintChat" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-start justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 20, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground leading-tight", children: "Privacy Policy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "Last updated ",
            (/* @__PURE__ */ new Date()).getFullYear()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card border border-border rounded-2xl p-6 elevation-sm mb-6",
          "data-ocid": "privacy.statement_card",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-base leading-relaxed font-medium", children: "GlintChat is private and secure. We do not track, sell, or analyze your data." })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-muted-foreground text-sm leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your messages are encrypted end-to-end and stored on the Internet Computer — a decentralized network with no single point of control." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your real name and phone number are used solely to identify you to other users. They are never shared with advertisers or third parties." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Verification payments are processed via manual bank transfer. GlintChat does not store any card or payment information." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Status posts are automatically deleted after 24 hours and are never archived or analyzed." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border px-4 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : ""
          )}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-foreground transition-colors",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  PrivacyPage
};
