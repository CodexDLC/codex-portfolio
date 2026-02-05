# 🎨 CSS Design Tokens & Migration Notes

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

This file describes not just a list of variables, but a design contract—which tokens are critical during the migration to Django and how to manage them.

## Goal

- Define a minimal set of design tokens that must be transferred to `static/css/` as `:root` variables.
- Provide instructions for linking tokens with Django settings or an external source (in the future).

## Mandatory Tokens (Contract)

Keep these variables in `:root`—they are used in components and documentation as the source specification.

```css
:root {
  --color-void: #...;
  --color-monolith: #...;
  --color-gold: #...;
  --color-blue: #...;
  --color-ivory: #...;
  --color-ghost: #...;

  --max-width: ...;
  --header-total-h: ...;
  --footer-height: ...;

  --font-primary: ...;
  --font-mono: ...;

  --transition-fast: ...;
  --transition-normal: ...;
  --transition-slow: ...;
}
```

**Note:** When changing values in `base.css`, update `variables.md` (this file)—it serves as the single source of truth for the design.

## How to Document Token Changes

1. When adding a new color/size, update `variables.md` with a short rationale (why the token is needed).
2. For each new variable, specify the scope of impact (e.g., `--color-accent` — used in `.bento-card-title`).

## Connection with Django

- You can store base tokens in `settings.py` (optional) and render them into `:root` via a template:

```django
<style>
:root {
  --color-gold: {% raw %}{{ DESIGN_TOKENS.color_gold }}{% endraw %};
}
</style>
```

- For rapid prototyping, we currently copy `:root` as a static file. Moving to runtime-managed tokens is optional.

## Breakpoints & Responsiveness — Recommendations

- Use a centralized set of breakpoints: mobile (<=767px), tablet (768-1279px), desktop (1280-1440px), large (>=1441px).
- Document component behavior when crossing breakpoints (e.g., `bento-grid` changes the number of columns).

## i18n & Text Related to Tokens

- If a token affects text display (e.g., `--font-size-base`), note it in `I18N_KEYS.md` so translations account for string lengths in different languages.

## Verification

1. After changing tokens, check all key pages (hero, bento, portfolio) on desktop/tablet/mobile.
2. Add visual tests (screenshots) if desired.
