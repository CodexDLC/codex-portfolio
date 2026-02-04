# 📋 Django Templates & Components Architecture

[⬅️ Back](../README.md) | [🏠 Root](/docs/README.md)

## Overview

This section documents the **Prototype → Django Migration** strategy. All
components from
`src/prototype/` are documented here with:

- **DJANGO comments** (`<!-- DJANGO: ... -->`) indicating optimization opportunities

- **i18n markers** (`<!-- i18n: key -->`) for internationalization

- **Inheritance patterns** showing how components will be refactored into Django
  template blocks

##

## 📁 Structure

### [CSS/](CSS/)

CSS variables, component structure, and responsive design patterns from
`src/prototype/css/`

| File | Purpose |
|------|---------|
| [variables.md](CSS/variables.md) | All `:root` variables (colors, sizes, breakpoints) |
| [components.md](CSS/components.md) | Component structure (layout, header, slides, bento-grid) |

### [JavaScript/](JavaScript/)

Vanilla JS modules with DOMContentLoaded patterns, state management, and i18n
integration

| File | Purpose |
|------|---------|
| [base-module.md](JavaScript/base-module.md) | Header animation, logo typing, mobile menu |
| [slides-module.md](JavaScript/slides-module.md) | Slide system, goToSlide() logic, cooldown mechanism |

### [HTML/](HTML/)

Django template hierarchy and inheritance patterns

| File | Purpose |
|------|---------|
| [base.html](HTML/base.html) | Base template with reusable blocks |
| [index.html](HTML/index.html) | Homepage (hero + bento grid) |
| [portfolio.html](HTML/portfolio.html) | Portfolio page with tab system |
| [experience.html](HTML/experience.html) | Experience/timeline page |
| [contact.html](HTML/contact.html) | Contact form page |

##

## 🌍 Internationalization

| File | Purpose |
|------|---------|
| [I18N_KEYS.md](I18N_KEYS.md) | Master list of all translation keys (EN/RU/DE) |
| [I18N_BEST_PRACTICE.md](I18N_BEST_PRACTICE.md) | Django gettext + JSON i18n architecture |

##

## 🔄 Migration Path

1. **CSS/JS** → Copy to Django `static/css/` and `static/js/`

2. **HTML** → Refactor to Django templates with `{% extends "base.html" %}`

3. **Text** → Extract to i18n keys (`.po` files and JSON)

4. **Data** → Replace hardcoded with Django context variables

##

## 📌 Prototyping Note

`src/prototype/` is the **development sandbox**:

- Deploys to GitHub Pages (`prototype.codexdlc.github.io`) as reference

- This documentation is generated from prototype code

- Not a final product—for experimentation and Django template design

