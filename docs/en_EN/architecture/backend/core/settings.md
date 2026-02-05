# ⚙️ Core Configuration

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../README.md)

## 1. Split Settings

We use `django-split-settings` structure:
* `base.py`: Shared config (Apps, Middleware, I18N).
* `dev.py`: Debug=True, Console Email Backend.
* `prod.py`: Sentry, S3 (optional), Security Headers.

## 2. Static & Media

* **Global Static:** `src/backend/static/` (Root).
  * We do NOT use app-specific static folders (e.g. `apps/main/static`) to simplify build.
* **Media:** `src/backend/media/` (Gitignored).

## 3. I18N (Internationalization)

* `USE_I18N = True`
* Locale Path: `src/backend/locale/`
* **Rule:** No hardcoded strings in templates. Always use `{% raw %}{% trans "Text" %}{% endraw %}`.
