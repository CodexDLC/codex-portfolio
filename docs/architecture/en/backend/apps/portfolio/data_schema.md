# 🗄️ Portfolio Data Schema

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

> **SOURCE OF TRUTH:** Implemented in `src/backend/apps/portfolio/models.py`.

## 1. The "Single Source" Strategy

We use **one table** (`Project`) for everything (Clients, SaaS, Open Source), distinguished by `Category` and `layout_type`.

## 2. Models

### A. `Category` (The Tab Controller)

Controls the tabs displayed on `/portfolio/`.

* **Fields:** `title`, `slug`, `order`.
* **Visuals:** `theme_color` (CSS class), `animation_preset` (JS effect).
* *Why?* Allows changing site structure via Admin Panel without deploying code.

### B. `Project` (The Content)

* **Core:** `title`, `slug`, `description`, `cover_image`.
* **Logic:**
  * `layout_type`: Enum (`case`, `product`, `repo`, `config`). Determines which HTML template to render.
  * `is_featured`: Boolean. If `True`, shows on the Index Page Bento Grid.
* **Flexibility:**
  * `extra_data` (JSONField): Stores unique data.
    * *Case:* `{"client": "Tesla", "year": "2024"}`
    * *Repo:* `{"stars": 405, "lang": "Python"}`

## 3. Admin Panel

* Must support **Drag & Drop** sorting for Categories.
* Project list must have filters by `layout_type`.
