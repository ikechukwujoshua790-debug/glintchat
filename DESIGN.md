# Design Brief

## Direction

GlintChat — A real-identity messaging app with forest green + gold premium branding, refined dark mode optimized for trust and clarity.

## Tone

Refined minimalism with botanical depth. Trustworthy like Telegram, distinctive through forest green primary and warm gold accents highlighting verification and admin status.

## Differentiation

Gold verification badges and admin channel highlights create a prestige tier. Depth layering via surface elevation (not shadows) gives modern chat feel. Verified users stand out through accent color micro-highlights.

## Color Palette

| Token      | OKLCH       | Role                                  |
| ---------- | ----------- | ------------------------------------- |
| background | 0.13 0.02 155 | Dark forest black, primary surface   |
| foreground | 0.92 0.01 150 | Off-white text for maximum legibility |
| card       | 0.17 0.022 155 | Elevated card background             |
| primary    | 0.65 0.18 155 | Botanical green for actions/focus   |
| accent     | 0.7 0.12 85   | Warm gold for verification/admin    |
| muted      | 0.21 0.025 155 | Secondary surface & dividers        |

## Typography

- Display: Space Grotesk — modern geometric, headings and highlights
- Body: Satoshi — clean humanist sans-serif for UI & messages
- Mono: JetBrains Mono — code, timestamps, verification IDs
- Scale: Hero `text-5xl font-bold tracking-tight`, h2 `text-3xl font-semibold`, label `text-xs font-semibold uppercase`, body `text-base`

## Elevation & Depth

No default shadows. Surface hierarchy through 2px-8px elevation tokens: `.elevation-sm` for message bubbles, `.elevation-md` for modal/drawer overlays. Card backgrounds raise from background via `bg-card` with subtle border.

## Structural Zones

| Zone    | Background     | Border               | Notes                                |
| ------- | -------------- | -------------------- | ------------------------------------ |
| Header  | `bg-card`      | `border-b border-border/50` | Nav/title, subtle elevation       |
| Sidebar | `bg-background` | `border-r border-border/50` | Conversation list, dense content   |
| Content | `bg-background` | —                    | Chat thread, spacious messaging    |
| Footer  | `bg-card`      | `border-t border-border/50` | Input area, input bar             |

## Spacing & Rhythm

Spacious messaging (12–16px message gaps), dense conversation list (8px compact items), large tap targets (44px min). Section separators use `border-border/50` at 4px opacity.

## Component Patterns

- Buttons: `bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90`
- Messages: `.message-bubble` with `rounded-2xl`, sent/received alternation via flex alignment
- Verified badges: `.badge-verified` — gold background 10% opacity + accent text, 12px pill shape
- Cards: `.status-card` rounded-lg, border-border/50, backdrop blur 4px, elevation-sm

## Motion

- Entrance: Staggered message appear (fadeIn 200ms each, 40ms stagger)
- Hover: `transition-smooth` (300ms ease) on interactive elements, 0.9 opacity on button press
- Decorative: None (minimal motion aligns with refined tone)

## Constraints

- No gradients, no glows, no neon effects
- Verified badge appears only with `.badge-verified` utility, never inline colors
- Dark mode only (light theme not in scope)
- All shadows replaced with elevation tokens and border opacity
- Maximum 3-tier depth: background < card < popover

## Signature Detail

Warm gold accent used sparingly for verification + admin badges creates visual hierarchy without noise. Botanical green primary paired with gold echoes the brand logo (green bubble + textured gold G) at the token level.
