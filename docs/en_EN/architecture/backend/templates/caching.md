# ⚡ Caching Strategy (Redis)

[⬅️ Back](./README.md)

## Overview
We use Redis to cache rendered HTML fragments. This significantly reduces DB queries and template rendering time, especially for the Bento Grid.

## 1. Fragment Caching
We use Django's `{% cache %}` template tag for expensive blocks that don't change often per user.

```django
{% load cache %}

<!-- Cache the footer for 24 hours -->
{% cache 86400 global_footer %}
    {% include "includes/footer.html" %}
{% endcache %}
```

## 2. HTMX & Caching
HTMX requests often fetch the same partials (e.g., a filtered grid).

*   **View-Level Caching:** We use `@cache_page` or manual `cache.get/set` in views for HTMX endpoints.
*   **Keys:** Cache keys must include filter parameters (e.g., `grid_category_backend_page_1`).

## 3. Invalidation
Since we cache HTML, we must invalidate it when data changes.

*   **Signals:** `post_save` / `post_delete` signals on `Project` and `Category` models trigger cache clearing.
*   **Granularity:** We prefer clearing the entire grid cache rather than complex partial updates, as read-heavy traffic dominates.
