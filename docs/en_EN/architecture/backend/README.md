# 🏗️ Backend Architecture Hub

[⬅️ Back](../../../architecture/README.md) | [🏠 Docs Root](../../../README.md)

> **SCOPE:** This folder documents the Django monolith in `src/backend/`.
> **PHILOSOPHY:** Hybrid Monolith (Django + HTMX). No DRF, No React.

## 1. Documentation Map (Mirror Structure)

We organize documentation exactly like the code to avoid chaos.

| Logic Module | Documentation Path | Description |
| :--- | :--- | :--- |
| **Core** | [`core/settings.md`](core/settings.md) | Settings, Env, Static Files strategy. |
| **Portfolio** | [`apps/portfolio/`](apps/portfolio/data_schema.md) | The main logic (Projects, Categories, HTMX). |
| **Templates** | [`templates/`](templates/README.md) | HTML/CSS/JS architecture. |

## 2. Global Rules

1. **Folder-First:** Even if a component is small, use a folder (e.g., `services/project_create.py`).
2. **Service Layer:**
  * **Selectors:** Read-only (QuerySets).
  * **Services:** Write/Mutate (Business Logic).
3. **Templates:**
  * Strict Namespacing: `apps/portfolio/templates/portfolio/...`
  * Smart Fragments: Use `_underscore` for HTMX partials.
