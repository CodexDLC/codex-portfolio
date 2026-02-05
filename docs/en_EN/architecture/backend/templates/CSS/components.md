# 🏗️ Components & Responsive Layout Principles

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

This document does not copy CSS entirely—it describes the principles, stages, and contract points that are important to preserve when migrating the prototype to Django templates and static files.

## Document Goals

- Explain the responsive layout architecture of the prototype.
- Identify blocks and extension points for Django templates (`{% raw %}{% include %}{% endraw %}`, `{% raw %}{% block %}{% endraw %}`).
- Provide recommendations for separation of concerns between HTML (templates), CSS (static files), and JS (behavior).

## Responsive Layout Structure (High Level)

1. **Layout container:** Fixed elements (`header`, `footer`) are centered via `left:50% + transform: translateX(-50%)` and constrained by `--max-width`.
2. **Main area:** `.slides-container` occupies the remaining height between `header` and `footer`.
3. **Screens:** Each screen is implemented as a `.slide` (hero, bento, etc.)—switched via classes `active`, `hidden-up`, `hidden-down`.
4. **Bento Grid Cards:** Responsive grid (`grid-template-columns: repeat(auto-fit, minmax(...))`) for fluid changes in column count.

## CSS/HTML → Django Migration Stages

1. Copy CSS/JS as static files to `static/css/` and `static/js/` (without editing). This allows templates to run quickly.
2. Create `base.html` with global blocks: `head`, `header`, `content`, `footer`, `extra_css`, `extra_js`.
3. Break repeatable fragments into partial templates (`includes`): `includes/header.html`, `includes/footer.html`, `includes/bento_card.html`.
4. In child templates, override the `content` block and include page-specific CSS/JS via `extra_css`/`extra_js`.
5. Replace relative asset paths with `{% raw %}{% static %}{% endraw %}` and all visible strings with `{% raw %}{% trans %}{% endraw %}` or i18n keys.

## Contract Points (What to Document/Preserve)

- **ID / Slide Classes:** `#slide-hero`, `#slide-bento`—do not change, JS relies on them.
- **State Classes:** `active`, `hidden-up`, `hidden-down`—keep for CSS/JS.
- **Navigation:** `.header-nav`, `.nav-burger`—move to `includes/header.html` and populate links via Django `url`.
- **Cards:** Create `includes/bento_card.html` with context `{% raw %}{% include 'includes/bento_card.html' with title=card.title description=card.desc %}{% endraw %}`.

## Examples: HTML Fragments to Templates

- **Static header (prototype):**

```html
<header class="layout-header"> ... nav links ... </header>
```

→ **Django:** `includes/header.html`

```django
<header class="layout-header">
  <div class="header-logo">{{ site_logo_html|safe }}</div>
  <nav class="header-nav">
    <a href="{% raw %}{% url 'home' %}{% endraw %}" class="nav-link">{% raw %}{% trans "nav_home" %}{% endraw %}</a>
    <!-- other links -->
  </nav>
  <button class="nav-burger">...</button>
</header>
```

## Naming & Layer Recommendations

- **Classes:** Semantic, not tied to JS logic (`.hero-title` instead of `.h1--01-js`).
- **JS Layer:** Relies on `id` and `data-` attributes (`data-tab`, `data-dna`)—these attributes must be preserved.
- **Data Components:** Render via Django context (model/serializer) or via `include`.

## i18n & Text

- All visible text must have i18n cases (`<!-- i18n: key -->` in documentation).
- In templates, use `{% raw %}{% trans "key" %}{% endraw %}` or pass strings from view via `gettext_lazy`.

## Post-Migration Verification

1. Run Django server and open pages: verify styles are loaded and `static` paths are correct.
2. Check slider behavior (wheel, mobile)—if classes don't match, JS won't work.
3. i18n Test: Change `LANGUAGE_CODE` or use `?lang=ru` and ensure `{% raw %}{% trans %}{% endraw %}` tags work.

## TODO / Possible Improvements

- Move repeating CSS values to design tokens and keep them in `variables.md`.
- Consider breaking large CSS files into logical modules during migration (header.css, hero.css, bento.css).
- Automate verification (CI) for matching id/classes between HTML and JS.
