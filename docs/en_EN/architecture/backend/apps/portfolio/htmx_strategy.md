# ⚡ HTMX & Islands Strategy

[⬅️ Back](../README.md) | [🏠 Docs Root](../../../../../README.md)

> **GOAL:** SPA-like experience without SPA complexity.

## 1. The "Smart Fragment" Concept

We do not reload the page. We replace the **Grid Container**.

* **Initial Load:** Server renders `portfolio.html` (Shell) + Active Category Grid.
* **Tab Click:**
  1. JS intercepts click.
  2. Plays `exit` animation on current grid.
  3. HTMX fetches `GET /portfolio/fragments/<category_slug>/`.
  4. Server returns **only** the HTML for the grid (no header/footer).
  5. HTMX swaps the content.
  6. JS plays `enter` animation based on `Category.animation_preset`.

## 2. Endpoint Structure

| URL | View Class | Response |
| :--- | :--- | :--- |
| `/portfolio/` | `PortfolioIndexView` | Full HTML (Shell + Default Grid) |
| `/portfolio/fragments/<slug>/` | `PortfolioFragmentView` | Partial HTML (`includes/_grid.html`) |

## 3. JavaScript Interceptor

Located in: `src/backend/static/js/portfolio.js`

Events to handle:
* `htmx:beforeRequest`: Lock UI, play Out-Animation.
* `htmx:afterSwap`: Unlock UI, play In-Animation (Glitch/Fade).
