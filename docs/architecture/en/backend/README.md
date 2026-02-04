# 🏗️ Backend Architecture Manifesto

[⬅️ Back](../README.md) | [🏠 Docs Root](/docs/README.md)

> **SCOPE:** This document governs the Django implementation in `src/backend/`.
> **PHILOSOPHY:** Granularity, OOP, and Separation of Concerns.

## 1. 📂 Application Structure (Folder-First)

We avoid "files that grow into walls of code". We prefer **folders** even for single components.

### Standard App Layout (`apps/portfolio/`)
```text
src/backend/apps/portfolio/
├── migrations/
├── templates/
│   └── portfolio/         # Namespaced templates (e.g. apps/portfolio/templates/portfolio/project_detail.html)
├── services/              # ⚡ WRITE Logic (Mutations)
│   ├── __init__.py        # Exposes Facade (Clean Import)
│   └── project_creator.py # Specific logic class
├── selectors/             # 🔍 READ Logic (Queries)
│   ├── __init__.py
│   └── project_list.py    # Specific query class
├── models/                # (Optional) If >1 model, use folder
│   ├── __init__.py
│   └── project.py
├── admin.py
├── apps.py
├── urls.py
└── views.py               # Thin Interface (CBV)
```

## 2. ⚙️ Core Patterns

### A. The Service Layer (CQS)
We separate **Reading** from **Writing**.

*   **Selectors (`selectors/`):**
    *   **Goal:** Fetch data for Views.
    *   **Rule:** Return DTOs or QuerySets. NEVER mutate DB.
    *   **Naming:** `ProjectListSelector`, `ExperienceContextSelector`.

*   **Services (`services/`):**
    *   **Goal:** Execute business logic (Create, Update, External API).
    *   **Rule:** Contain transaction logic.
    *   **Naming:** `ContactFormService`, `ProjectUpdateService`.
    *   **Tip:** Use `__init__.py` to allow imports like `from .services import create_project`.

### B. View Layer (Thin & Class-Based)
*   **Base:** Always inherit from `django.views.generic` (TemplateView, ListView).
*   **Logic:** Views only dispatch requests to Services/Selectors.
*   **Async:** Default is `Sync`. Use `async def` only for specific I/O heavy endpoints.

## 3. 🎨 Static & Templates

### Centralized Static
*   **Location:** `src/backend/static/` (Root).
*   **No App Static:** We do not store CSS/JS inside `apps/` to avoid build complexity.
*   **Structure:**
    ```text
    static/
    ├── css/
    ├── js/
    └── img/
    ```

### Modular Templates
*   **Namespacing:** `apps/main/templates/main/home.html`.
*   **Components:** Complex UI parts go to `includes/` folder inside templates.
*   **I18n:** `USE_I18N = True`. No hardcoded strings. Use `{% trans %}`.

## 4. 🚀 Apps Registry
Current active modules:

*   `core`: Settings, WSGI/ASGI configuration.
*   `main`: Static pages (Home, Experience, Contact).
*   `portfolio`: Dynamic content (Projects, Cases).
