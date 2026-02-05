# 🏠 Main App Architecture

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

> **SCOPE:** `src/backend/apps/main/`
> **PURPOSE:** Static pages, Home Page composition, Contact Forms.

## 1. Responsibilities

The `main` app acts as the "Face" of the website. It aggregates data from other apps (like `portfolio`) to display on the Home Page.

* **Home Page:** Hero Section + Bento Grid (Feeds from Portfolio).
* **Experience:** Timeline visualization.
* **Contact:** Form handling and email logic.

## 2. Views & Logic

### A. Home View (`IndexView`)

* **Route:** `/`
* **Template:** `main/templates/home.html`
* **Context:**
    * `featured_projects`: Fetches `Project.objects.filter(is_featured=True)` from the Portfolio app.
    * *Note:* This creates a dependency on `apps.portfolio`.

### B. Contact View (`ContactView`)

* **Route:** `/contact/`
* **Logic:**
    1.  Validates `ContactForm`.
    2.  Saves message to DB (`ContactMessage` model).
    3.  (Future) Sends async email via Celery.
    4.  Returns HTMX partial for "Success" state.

## 3. UI Components

This app owns the global UI shell components located in `templates/includes/`:

* `_header.html`: Main navigation.
* `_footer.html`: Global footer.
* `_bento_section.html`: The grid layout wrapper.