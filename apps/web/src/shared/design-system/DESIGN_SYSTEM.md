# ProFile Design System v4.0

A comprehensive design system for the ProFile frontend application, providing consistent styling across all components.

## Architecture

```
apps/web/src/
├── app/globals.css          # CSS variables (source of truth)
├── shared/
│   └── design-system/
│       ├── index.ts         # Barrel exports
│       ├── tokens.ts        # TypeScript token definitions
│       └── DESIGN_SYSTEM.md # This documentation
```

### Philosophy

1. **CSS Variables are the source of truth** - Runtime styling uses `var(--pf-*)` variables defined in `globals.css`
2. **TypeScript tokens provide DX** - Type-safe exports with autocomplete for development
3. **Dark-first design** - Default theme is dark, with light mode overrides
4. **Consistent naming** - All custom properties use `--pf-{category}-{variant}` pattern

---

## Color System

### Semantic Categories

| Category | Purpose | CSS Variable Pattern |
|----------|---------|---------------------|
| Canvas | Backgrounds | `--pf-canvas-*` |
| Foreground | Text colors | `--pf-fg-*` |
| Border | Borders & dividers | `--pf-border-*` |
| Accent | Primary interactive (cyan) | `--pf-accent-*` |
| Success | Positive states (emerald) | `--pf-success-*` |
| Attention | Warning states (amber) | `--pf-attention-*` |
| Danger | Error states (red) | `--pf-danger-*` |
| Done | Completed states (purple) | `--pf-done-*` |
| Neutral | Disabled/muted | `--pf-neutral-*` |

### Color Variants

Each semantic category has consistent variants:

| Variant | Usage | Example |
|---------|-------|---------|
| `fg` | Text color | `text-pf-accent-fg` |
| `emphasis` | Solid backgrounds | `bg-pf-accent-emphasis` |
| `muted` | Semi-transparent (30%) | `bg-pf-accent-muted` |
| `subtle` | Low opacity (10%) | `bg-pf-accent-subtle` |

### Dark Theme (Default)

```css
/* Canvas */
--pf-canvas-default: #020202;
--pf-canvas-subtle: #0a0a0a;
--pf-canvas-inset: #000000;
--pf-canvas-overlay: #0a0a0a;
--pf-canvas-emphasis: #ffffff;

/* Foreground */
--pf-fg-default: #fafafa;
--pf-fg-muted: #a1a1aa;
--pf-fg-subtle: #8b8b96;
--pf-fg-onEmphasis: #020202;

/* Accent (Cyan) */
--pf-accent-fg: #22d3ee;
--pf-accent-emphasis: #06b6d4;
--pf-accent-muted: rgba(34, 211, 238, 0.3);
--pf-accent-subtle: rgba(34, 211, 238, 0.1);
```

### Light Theme

Light theme colors are applied via `.light` class or `prefers-color-scheme: light`:

```css
.light {
  --pf-canvas-default: #fafafa;
  --pf-canvas-subtle: #f4f4f5;
  --pf-fg-default: #18181b;
  --pf-fg-muted: #3f3f46;
  --pf-accent-fg: #0e7490;
  --pf-accent-emphasis: #0891b2;
}
```

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `sans` | Inter, system-ui | Body text |
| `display` | Syne, Inter | Headlines |
| `mono` | Geist Mono | Code |

### Font Sizes

| Token | Size | Tailwind |
|-------|------|----------|
| `xs` | 12px | `text-xs` |
| `sm` | 14px | `text-sm` |
| `base` | 16px | `text-base` |
| `lg` | 18px | `text-lg` |
| `xl` | 20px | `text-xl` |
| `2xl` | 24px | `text-2xl` |
| `3xl` | 30px | `text-3xl` |
| `4xl` | 36px | `text-4xl` |
| `5xl` | 48px | `text-5xl` |
| `6xl` | 60px | `text-6xl` |

### Font Weights

| Token | Value |
|-------|-------|
| `normal` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |

---

## Spacing

Based on a 4px unit system:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing |
| `2` | 8px | Small gaps |
| `3` | 12px | Component padding |
| `4` | 16px | Standard gap |
| `6` | 24px | Section spacing |
| `8` | 32px | Large gaps |
| `12` | 48px | Section margins |
| `16` | 64px | Page sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small elements |
| `md` | 8px | Buttons, inputs |
| `lg` | 12px | Cards |
| `xl` | 16px | Modals |
| `2xl` | 24px | Large cards |
| `full` | 9999px | Pills, avatars |

---

## Shadows

| Token | Usage |
|-------|-------|
| `sm` | Subtle depth |
| `md` | Cards |
| `lg` | Dropdowns |
| `xl` | Modals |
| `glow` | Ambient glow |
| `glowAccent` | Accent highlight |
| `glowSuccess` | Success indicator |
| `glowDanger` | Error indicator |

---

## Animation

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `instant` | 0ms | No animation |
| `fast` | 150ms | Micro-interactions |
| `normal` | 200ms | Standard transitions |
| `slow` | 300ms | Emphasis |
| `slower` | 500ms | Page transitions |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `default` | cubic-bezier(0.4, 0, 0.2, 1) | Standard |
| `in` | cubic-bezier(0.4, 0, 1, 1) | Enter |
| `out` | cubic-bezier(0, 0, 0.2, 1) | Exit |
| `bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Playful |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `behind` | -1 | Behind content |
| `base` | 0 | Default |
| `docked` | 10 | Fixed elements |
| `dropdown` | 20 | Dropdowns |
| `sticky` | 30 | Sticky headers |
| `banner` | 40 | Banners |
| `overlay` | 50 | Overlays |
| `modal` | 60 | Modals |
| `popover` | 70 | Popovers |
| `toast` | 80 | Toasts |
| `tooltip` | 90 | Tooltips |
| `max` | 9999 | Always on top |

---

## Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Wide screens |

---

## Usage Examples

### CSS/Tailwind

```tsx
// Using Tailwind classes with design tokens
<div className="bg-pf-canvas-subtle border-pf-border-default">
  <h1 className="text-pf-fg-default font-semibold">
    Title
  </h1>
  <p className="text-pf-fg-muted">
    Description
  </p>
  <button className="bg-pf-accent-emphasis text-pf-fg-onEmphasis">
    Action
  </button>
</div>
```

### TypeScript

```typescript
import { colors, cssVar, pfVar, matchesBreakpoint } from '@/shared/design-system';

// Direct value access
const primaryColor = colors.accent.fg; // '#22d3ee'

// CSS variable reference
const bgVar = pfVar('canvas-default'); // 'var(--pf-canvas-default)'

// Responsive check (client-side)
if (matchesBreakpoint('md')) {
  // Tablet or larger
}
```

### Component Styling

```typescript
import { colors, animation } from '@/shared/design-system';

const buttonStyles = {
  backgroundColor: colors.accent.emphasis,
  color: colors.fg.onEmphasis,
  transition: animation.transition.fast,
};
```

---

## Migration Guide

### Replacing Hardcoded Colors

| Before | After |
|--------|-------|
| `text-white` | `text-pf-fg-default` |
| `text-zinc-400` | `text-pf-fg-muted` |
| `text-zinc-500` | `text-pf-fg-muted` |
| `text-zinc-600` | `text-pf-fg-subtle` |
| `bg-white/5` | `bg-pf-hover-subtle` |
| `bg-white/10` | `bg-pf-hover-default` |
| `border-white/10` | `border-pf-border-default` |
| `bg-[#0A0A0A]` | `bg-pf-canvas-subtle` |
| `text-cyan-400` | `text-pf-accent-fg` |
| `bg-cyan-500` | `bg-pf-accent-emphasis` |

### Component Patterns

```tsx
// Before
<div className="bg-white/5 hover:bg-white/10 border border-white/10">

// After
<div className="bg-pf-hover-subtle hover:bg-pf-hover-default border border-pf-border-default">
```

---

## Best Practices

### DO

- Use semantic color tokens (`accent`, `success`, `danger`) over raw colors
- Use the variant pattern (`fg`, `emphasis`, `muted`, `subtle`) consistently
- Use TypeScript imports for type safety and autocomplete
- Use CSS variables for runtime theming

### DON'T

- Don't use raw hex values in components
- Don't use Tailwind's default color palette (zinc-*, slate-*, etc.)
- Don't create new color variables without adding to the design system
- Don't use inline styles with hardcoded colors

---

## Component Tokens

Pre-defined token combinations for common components:

### Button

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| Primary | `#ffffff` | `#ffffff` | `#020202` |
| Secondary | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.1)` | `#fafafa` |
| Outline | `transparent` | `rgba(255,255,255,0.1)` | `#fafafa` |
| Danger | `rgba(248,113,113,0.1)` | `rgba(248,113,113,0.3)` | `#f87171` |

### Input

| State | Background | Border |
|-------|------------|--------|
| Default | `rgba(255,255,255,0.02)` | `rgba(255,255,255,0.1)` |
| Focus | - | `rgba(34,211,238,0.5)` |
| Error | - | `#f87171` |
| Disabled | `rgba(255,255,255,0.05)` | - |

### Card

| Variant | Background | Border |
|---------|------------|--------|
| Default | `rgba(10,10,10,0.8)` | `rgba(255,255,255,0.1)` |
| Muted | `rgba(255,255,255,0.02)` | - |

---

## File Checklist

When creating new components:

1. [ ] Use semantic color tokens from the design system
2. [ ] Use spacing tokens for padding/margins
3. [ ] Use radius tokens for border-radius
4. [ ] Use animation tokens for transitions
5. [ ] Support dark/light themes via CSS variables
6. [ ] Test in both color schemes
