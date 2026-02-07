# 🗄️ Portfolio Data Schema

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

> **SOURCE OF TRUTH:** Implemented in `src/backend/features/portfolio/models/`.

## 1. Overview

The Portfolio app manages the showcase of projects. It relies heavily on the `system` app for classification and styling.

## 2. Models

### A. `Category` (The Tab Controller)

Controls the tabs displayed on the main portfolio page.

*   **Source:** `src/backend/features/portfolio/models/category.py`
*   **Identity:** `name`, `slug`.
*   **Tab Configuration:**
    *   `tab_filename`: The HTMX partial to load (e.g., `clients.py` -> maps to template).
    *   `tab_icon_text` / `tab_icon_class`: Visuals for the tab button.
*   **Section Configuration:**
    *   `section_number`: Display number (e.g., "01").
    *   `section_title`: Header title (e.g., "CLIENT SOLUTIONS").
*   **Visuals:**
    *   `theme_class`: CSS theme applied to the section (e.g., `theme-gold`).

### B. `Project` (The Content)

The core entity representing a case study, repository, or product.

*   **Source:** `src/backend/features/portfolio/models/project.py`
*   **Core:** `title`, `slug`, `description`, `content` (Markdown/HTML).
*   **Classification:**
    *   `category`: FK to `Category`.
    *   `status`: Enum (Dev, Prod, Support, Archived, Concept).
    *   `project_type`: Enum (Commercial, Startup, Open Source, Pet, Enterprise).
    *   `tags`: M2M to `system.TechTag` (Technologies used).
*   **Visuals:**
    *   `style_visual`: FK to `system.StyleAttribute` (Bento card style).
    *   *Note:* Layout size is calculated dynamically by `LayoutService`, not stored in DB.
*   **Metrics:** `views_count`, `likes_count`, `is_featured`.
*   **Links:** `link_demo`, `link_github`.

## 3. Relations

*   **System Integration:**
    *   Projects use `TechTag` for stack definition.
    *   Projects use `StyleAttribute` for visual themes.

## 4. Admin Panel

*   **Sorting:** Drag & Drop supported for Categories (`order` field).
*   **Filtering:** Projects filterable by status and category.
