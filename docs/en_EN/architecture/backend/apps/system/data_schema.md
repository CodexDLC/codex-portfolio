# ⚙️ System Data Schema

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

> **SOURCE OF TRUTH:** Implemented in `src/backend/features/system/models/`.

## 1. Overview

The `system` app provides universal dictionaries and configurations used across the entire project (Portfolio, Blog, Experience). It ensures consistency in styling and categorization.

## 2. Models

### A. `TechTag` (Universal Tags)

A unified dictionary for technologies, project statuses, and types.

*   **Source:** `src/backend/features/system/models/tech_tag.py`
*   **Key Fields:**
    *   `name`: Display name (e.g., "Python").
    *   `slug`: URL-friendly identifier.
    *   `category`:
        *   **Tech Stack:** `backend`, `frontend`, `database`, `devops`, `tools`.
        *   **Meta:** `project_status` (Dev, Prod), `project_type` (Startup, Open Source).
    *   `icon_class`: CSS class for icons (e.g., `devicon-python-plain`).
    *   `color_hex`: Optional UI color.

### B. `StyleAttribute` (Design System)

A database-driven design system allowing visual changes without code deployment.

*   **Source:** `src/backend/features/system/models/style_atribute.py`
*   **Key Fields:**
    *   `name`: Admin-friendly name.
    *   `css_class`: The actual CSS class applied in templates (unique).
    *   `attr_type`:
        *   `layout`: Grid sizes, spacing.
        *   `visual`: Themes, colors (e.g., `theme-gold`).
        *   `typography`: Fonts, text styles.
        *   `state`: Interactive states.
    *   `target_area`: Scope of application (`all`, `portfolio`, `experience`).

## 3. Usage

*   **Projects:** Linked via `tags` (M2M to `TechTag`) and `style_visual` (FK to `StyleAttribute`).
*   **Filtering:** Frontend filters use `TechTag` slugs.
