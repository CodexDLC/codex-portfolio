# 🏗️ Data Schema: Portfolio (Single Source)

[⬅️ Back](./README.md) | [🏠 Docs Root](/docs/README.md)

&gt; **STRATEGY:** Single Source of Truth + HTMX Controls.
&gt; This schema defines the database structure for `apps/portfolio`.

## 1. Concept
We use a **Category-Driven** approach. The database controls not just data, but also the Frontend UI (Tabs, Themes, Animations).

## 2. Models Specification

### A. Model: `Category`
**Role:** Controls the "Tabs" on the portfolio page.
* **Fields:**
    * `title` (String): Display name (e.g., "Clients").
    * `slug` (Slug): URL part.
    * `order` (Int): Sorting index (0, 1, 2...).
    * `theme_color` (String): CSS class for theming (e.g., `theme-gold`, `theme-void`).
    * `animation_preset` (String): JS animation trigger (e.g., `fade`, `glitch`, `slide`).

### B. Model: `Project`
**Role:** Universal item storage.
* **Relationships:** ForeignKey to `Category`.
* **Base Fields:** `title`, `slug`, `description`, `cover_image`.
* **Logic Fields:**
    * `layout_type` (Choices): Determines which HTML template partial to render (`case`, `product`, `repo`, `config`).
    * `is_featured` (Bool): If true, appears on Home Page Bento Grid.
* **Flexibility:**
    * `extra_data` (JSONField): Stores unique data per layout type (e.g., `{"stars": 100}` for Repo, `{"client": "NASA"}` for Case).

## 3. Admin Panel Requirements
* **Category:** Must allow reordering (Drag & Drop or numeric editing).
* **Project:** Must display `layout_type` and `is_featured` filters.
