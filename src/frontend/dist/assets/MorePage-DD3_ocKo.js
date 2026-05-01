import { r as reactExports, j as jsxRuntimeExports, u as useNavigate } from "./index-DFLYPydE.js";
import { A as AuthGuard } from "./AuthGuard-D-PieWoW.js";
import { u as useCallerProfile, v as useIsAdmin, L as Layout, S as Shield } from "./Layout-81mP_Nwv.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-DkW0CPeH.js";
import { P as Primitive } from "./index-15HxH_qF.js";
import { c as createLucideIcon, a as cn, S as ShieldCheck } from "./button-CQxG3T_J.js";
import { S as Skeleton } from "./skeleton-36fIiUBT.js";
import { u as useAuth } from "./useAuth-CCsbb51x.js";
import { B as BadgeCheck } from "./badge-check-B9svzj52.js";
import { Q as QrCode } from "./qr-code-5IYm5C5u.js";
import { L as Lock } from "./lock-C3cDJ3EE.js";
import "./index-B-snK1QX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode);
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = x << 1;
    if (x & 256) x ^= 285;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();
function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255];
}
function gfPolyMul(p, q) {
  const r = new Array(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i++)
    for (let j = 0; j < q.length; j++) r[i + j] ^= gfMul(p[i], q[j]);
  return r;
}
function rsGeneratorPoly(n) {
  let g = [1];
  for (let i = 0; i < n; i++) g = gfPolyMul(g, [1, GF_EXP[i]]);
  return g;
}
function rsEncode(data, ecLen) {
  const gen = rsGeneratorPoly(ecLen);
  const msg = [...data, ...new Array(ecLen).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0)
      for (let j = 0; j < gen.length; j++) msg[i + j] ^= gfMul(gen[j], coef);
  }
  return msg.slice(data.length);
}
const VERSION_TABLE = [
  [1, 16, 10, 0],
  [2, 28, 16, 7],
  [3, 44, 26, 7],
  [4, 64, 36, 7],
  [5, 86, 48, 7],
  [6, 108, 64, 7],
  [7, 124, 72, 0]
];
function pickVersion(byteLen) {
  const bits = 4 + 8 + 8 * byteLen;
  for (const [v, dc] of VERSION_TABLE) {
    if (dc * 8 >= bits) return v;
  }
  return 7;
}
function buildBitBuffer(text, version) {
  const bytes = new TextEncoder().encode(text);
  const [, dc] = VERSION_TABLE[version - 1];
  const buf = [];
  buf.push(0, 1, 0, 0);
  const len = bytes.length;
  for (let i = 7; i >= 0; i--) buf.push(len >> i & 1);
  for (const b of bytes) for (let i = 7; i >= 0; i--) buf.push(b >> i & 1);
  for (let i = 0; i < 4 && buf.length < dc * 8; i++) buf.push(0);
  while (buf.length % 8 !== 0) buf.push(0);
  const padBytes = [236, 17];
  let pi = 0;
  while (buf.length < dc * 8) {
    const pb = padBytes[pi++ % 2];
    for (let i = 7; i >= 0; i--) buf.push(pb >> i & 1);
  }
  return buf;
}
function bitsToBytes(bits) {
  const out = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = b << 1 | (bits[i + j] ?? 0);
    out.push(b);
  }
  return out;
}
function matrixSize(v) {
  return 4 * v + 17;
}
function createMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(-1));
}
function setFinderPattern(m, row, col) {
  for (let r = -1; r <= 7; r++)
    for (let c = -1; c <= 7; c++) {
      const mr = row + r;
      const mc = col + c;
      if (mr < 0 || mr >= m.length || mc < 0 || mc >= m.length) continue;
      const dark = r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4;
      m[mr][mc] = dark ? 1 : 0;
    }
}
function setAlignmentPattern(m, row, col) {
  for (let r = -2; r <= 2; r++)
    for (let c = -2; c <= 2; c++) {
      const dark = r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0;
      m[row + r][col + c] = dark ? 1 : 0;
    }
}
const ALIGN_POS = {
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38]
};
function placeFinderPatterns(m, size) {
  setFinderPattern(m, 0, 0);
  setFinderPattern(m, 0, size - 7);
  setFinderPattern(m, size - 7, 0);
}
function placeAlignmentPatterns(m, version) {
  const pos = ALIGN_POS[version];
  if (!pos) return;
  for (const r of pos)
    for (const c of pos) {
      if (m[r][c] !== -1) continue;
      setAlignmentPattern(m, r, c);
    }
}
function placeTimingPatterns(m, size) {
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0 ? 1 : 0;
    m[i][6] = i % 2 === 0 ? 1 : 0;
  }
}
function placeDarkModule(m, version) {
  m[4 * version + 9][8] = 1;
}
function reserveFormatAreas(m, size) {
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === -1) m[8][i] = 2;
    if (m[i][8] === -1) m[i][8] = 2;
  }
  for (let i = size - 8; i < size; i++) {
    if (m[8][i] === -1) m[8][i] = 2;
    if (m[i][8] === -1) m[i][8] = 2;
  }
}
function placeDataBits(m, data, size, remainder) {
  const bits = [];
  for (const b of data) for (let i = 7; i >= 0; i--) bits.push(b >> i & 1);
  for (let i = 0; i < remainder; i++) bits.push(0);
  let bitIdx = 0;
  let goUp = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    const rowRange = goUp ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
    for (const row of rowRange) {
      for (const dc of [0, 1]) {
        const c = col - dc;
        if (m[row][c] === -1) {
          m[row][c] = bitIdx < bits.length ? bits[bitIdx++] : 0;
        }
      }
    }
    goUp = !goUp;
  }
}
function applyMask(m, size) {
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (m[r][c] <= 1 && (r + c) % 2 === 0) m[r][c] ^= 1;
}
const FORMAT_BITS_M0 = "101010000010010";
function placeFormatInfo(m, size) {
  const fb = FORMAT_BITS_M0;
  const bits = fb.split("").map(Number);
  const positions1 = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = positions1[i];
    m[r][c] = bits[i];
  }
  for (let i = 0; i < 8; i++) m[8][size - 1 - i] = bits[i];
  for (let i = 0; i < 7; i++) m[size - 7 + i][8] = bits[14 - i];
}
function generateQRMatrix(text) {
  const version = Math.min(
    pickVersion(new TextEncoder().encode(text).length),
    7
  );
  const [, dc, ec, remainder] = VERSION_TABLE[version - 1];
  const size = matrixSize(version);
  const m = createMatrix(size);
  placeFinderPatterns(m, size);
  placeAlignmentPatterns(m, version);
  placeTimingPatterns(m, size);
  placeDarkModule(m, version);
  reserveFormatAreas(m, size);
  const bits = buildBitBuffer(text, version);
  const dataBytes = bitsToBytes(bits);
  const ecBytes = rsEncode(dataBytes.slice(0, dc), ec);
  const allBytes = [...dataBytes.slice(0, dc), ...ecBytes];
  placeDataBits(m, allBytes, size, remainder);
  applyMask(m, size);
  placeFormatInfo(m, size);
  return m;
}
function QRCodeDisplay({
  value,
  size = 200,
  className
}) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    if (!canvasRef.current || !value) return;
    try {
      const matrix = generateQRMatrix(value);
      const canvas = canvasRef.current;
      const moduleCount = matrix.length;
      const moduleSize = Math.floor(size / (moduleCount + 8));
      const padding = Math.floor((size - moduleSize * moduleCount) / 2);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000000";
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (matrix[r][c] === 1) {
            ctx.fillRect(
              padding + c * moduleSize,
              padding + r * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }
    } catch {
      const ctx = (_a = canvasRef.current) == null ? void 0 : _a.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#999";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("QR unavailable", size / 2, size / 2);
      }
    }
  }, [value, size]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: size,
      height: size,
      className,
      "aria-label": "QR code"
    }
  );
}
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function initials(name) {
  return name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
const menuItems = [
  {
    label: "Get Verified",
    icon: ShieldCheck,
    path: "/verify",
    ocid: "more.verify_link",
    variant: "highlight"
  },
  {
    label: "Privacy Policy",
    icon: Lock,
    path: "/privacy",
    ocid: "more.privacy_link"
  }
];
const adminMenuItem = {
  label: "Admin Dashboard",
  icon: Shield,
  path: "/admin",
  ocid: "more.admin_link",
  variant: "admin"
};
function MorePage() {
  const { logout, isAuthenticated } = useAuth();
  const { data: profile, isLoading } = useCallerProfile();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const qrValue = profile ? `glintchat://profile/${profile.id.toString()}` : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-4 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-semibold text-xl text-foreground", children: "More" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "more.profile_card",
          className: "bg-card border border-border rounded-2xl p-4",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "more.loading_state",
              className: "flex items-center gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-36" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" })
                ] })
              ]
            }
          ) : profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-16 h-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/20 text-primary text-xl font-bold", children: initials(profile.realName) }) }),
              profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute -bottom-1 -right-1 bg-background rounded-full p-0.5",
                  title: "Verified",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BadgeCheck,
                    {
                      size: 18,
                      className: "text-blue-400 fill-blue-400/20",
                      "aria-label": "Verified account"
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground truncate", children: profile.realName }),
                profile.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  BadgeCheck,
                  {
                    size: 16,
                    className: "text-blue-400 shrink-0",
                    "aria-label": "Verified"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: profile.phone }),
              profile.isVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "badge-verified mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }),
                "Verified"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "more.get_verified_button",
                  onClick: () => navigate({ to: "/verify" }),
                  className: "inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 hover:underline mt-1.5 transition-colors",
                  "aria-label": "Get verified for $6",
                  children: [
                    "Get Verified for $6",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
                  ]
                }
              )
            ] })
          ] }) : null
        }
      ),
      profile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "more.qr_code_section",
          className: "bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 self-stretch", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { size: 16, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: "My QR Code" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Others can scan this to add you on GlintChat" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-xl overflow-hidden p-2 bg-white",
                "aria-label": "Your GlintChat QR code",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  QRCodeDisplay,
                  {
                    value: qrValue,
                    size: 180,
                    className: "block rounded"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center leading-relaxed max-w-[220px]", children: "Share this code so contacts can find you instantly on GlintChat" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [...menuItems, ...isAdmin === true ? [adminMenuItem] : []].map(
        (item, idx) => {
          const Icon = item.icon;
          const isHighlight = item.variant === "highlight";
          const isAdminItem = item.variant === "admin";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            idx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": item.ocid,
                onClick: () => navigate({ to: item.path }),
                className: "w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-smooth text-left",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isHighlight ? "bg-blue-500/15" : isAdminItem ? "bg-accent/15" : "bg-secondary"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Icon,
                        {
                          size: 18,
                          className: isHighlight ? "text-blue-400" : isAdminItem ? "text-accent" : "text-muted-foreground"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `flex-1 text-sm font-medium min-w-0 ${isHighlight ? "text-blue-400" : isAdminItem ? "text-accent" : "text-foreground"}`,
                      children: item.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ChevronRight,
                    {
                      size: 16,
                      className: "text-muted-foreground shrink-0"
                    }
                  )
                ]
              }
            )
          ] }, item.label);
        }
      ) }),
      isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "more.logout_button",
          onClick: logout,
          className: "w-full px-4 py-3 bg-card border border-border rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth text-left",
          children: "Sign Out"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : ""
          )}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
          children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            ". Built with love using caffeine.ai"
          ]
        }
      ) })
    ] })
  ] }) }) });
}
export {
  MorePage
};
