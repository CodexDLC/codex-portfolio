# 🎨 Django Templates & Frontend Architecture

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../README.md)

> **STACK:** Django Templates + HTMX + Redis Cache.
> **PHILOSOPHY:** No React/Vue. Server-Side Rendering (SSR) with partial updates.

## 1. Core Concepts

### A. Bento Grid Layout
We abandoned complex layouts ("Triple Split", "Slides") in favor of a unified **Adaptive Bento Grid**.
*   **Desktop:** Multi-column mosaic.
*   **Mobile:** Single column stack.
*   **Logic:** Card sizes are calculated by `LayoutService` based on project weight.

### B. HTMX & Partials
We do not reload full pages.
*   **Partials:** Templates starting with `_` (e.g., `_project_card.html`) are designed for HTMX responses.
*   **Interactions:** Filtering, pagination, and tab switching happen via AJAX replacement of HTML fragments.

### C. Redis Caching
High performance is achieved by caching rendered HTML fragments.
*   See [Caching Strategy](caching.md).

## 2. Directory Structure

```text
templates/
├── base.html             # Global wrapper (SEO, CSS, JS)
├── includes/             # Reusable components (Header, Footer)
├── portfolio/            # Portfolio App
│   ├── index.html        # Main entry point
│   ├── _grid.html        # HTMX partial for the grid
│   └── _card.html        # Single project card
└── system/               # System pages (404, 500)
```

## 3. Key Rules

1.  **No Business Logic:** Templates should only display data provided by the View/Context.
2.  **Strict Namespacing:** App templates must be inside `templates/<app_name>/`.
3.  **I18N:** All text must be wrapped in `{% trans %}`.
