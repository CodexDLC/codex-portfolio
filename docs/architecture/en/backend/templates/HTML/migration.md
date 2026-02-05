# HTML → Django Templates: Migration Principles

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

This document describes the practical steps and rules to follow when converting prototype HTML into maintainable and extensible Django templates.

## 1. General Concept

- The prototype contains static HTML, CSS, and JS. During migration, we extract:
  - **Global Wrapper (`base.html`):** Common metadata, CSS/JS, header/footer.
  - **Partial Templates (`includes/`):** Repeatable fragments (header, footer, card).
  - **Pages (Child Templates):** Extend `base.html` and populate the `content` block.

## 2. Template Structure (Recommended)

```
templates/
├── base.html
├── includes/
│   ├── header.html
│   ├── footer.html
│   └── bento_card.html
├── index.html
├── portfolio.html
├── experience.html
└── contact.html
```

## 3. `base.html` Blocks

- `title`: Page title.
- `extra_css`: Page-specific CSS.
- `header`: Global header (default include).
- `content`: Main page content.
- `footer`: Global footer.
- `extra_js`: Page-specific JS.

Use named blocks to minimize duplication.

## 4. HTML Fragment Conversion Rules

1. **Static Paths:** Replace with `{% static 'path' %}`.
2. **Links:** Replace with `{% url 'name' %}` (use named routes).
3. **Visible Strings:** Extract to i18n: `{% trans "key" %}` or via context if dynamic.
4. **Attributes:** Keep `id` and key `data-*` attributes unchanged (JS relies on them).
5. **Static Content Blocks:** Convert to `include` and pass context via `with`.

## 5. Cards (Bento) — Template & Context

- Create `includes/bento_card.html`:

```django
<article class="bento-card">
  <h3 class="bento-card-title">{{ title }}</h3>
  <p class="bento-card-description">{{ description }}</p>
</article>
```

- Render in parent template:

```django
{% for card in cards %}
  {% include 'includes/bento_card.html' with title=card.title description=card.description %}
{% endfor %}
```

## 6. Data Passing: View Context

- Define minimal context in `views.py` for each page.

```python
def portfolio(request):
    cards = Card.objects.all()
    context = { 'cards': cards }
    return render(request, 'portfolio.html', context)
```

## 7. JavaScript Integration

- Include global scripts in `base.html`.
- Page-specific scripts go in the `extra_js` block.
- JS should expect `id`/`data-` contracts, not a rigid DOM structure within a specific page.

## 8. i18n & Text

- Mark keys in templates: `<!-- i18n: key_name -->` in docs; in templates — `{% trans "key_name" %}`.
- For dynamic text in JS, use `static/i18n/*.json` and a `t(key)` helper.

## 9. Verification & Acceptance

1. Static assets load via `{% static %}` and are accessible.
2. Navigation works via `{% url %}` and resides in `includes/header.html`.
3. JS functionality (typing, slides) remains operational—check target `id`/`data-*`.

## 10. Common Migration Improvements

- Move menu to context (dynamic links from DB).
- Store "intro shown" flags in user profile / Django sessions.
- Break large CSS into modules when preparing for theme support.
- Automate verification (CI) for matching id/classes between HTML and JS.
