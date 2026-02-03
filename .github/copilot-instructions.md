# CodexDLC Portfolio - AI Agent Instructions

## 🎯 Project Overview
A portfolio website featuring a **"Developer's Life Cycle" (DLC)** personal brand system. Built as a **single-page application with a slide system** (hero + bento grid), using vanilla JS, CSS, and Python backend. Styled with a **Pythonic Dark Theme** (IDE-inspired aesthetics with terminal UI flavor).

**Stack:** Python 3.13+, Poetry, HTML/CSS/JS (vanilla), Django (backend planned), Docker/Nginx (deployment)

**Core Ideology:** This project follows **Vertical Slices** (domain isolation), **Twin Realms** documentation (EN for specs, RU for architecture), and **Framework-Native-First** approach.

**Prototype & Documentation Strategy:**
- `src/prototype/` is a **development sandbox** for testing UI/UX before Django migration
- Prototype deploys to **GitHub Pages** (subdomain, e.g., `prototype.codexdlc.github.io`) as reference implementation
- `docs/architecture/en/templates/` documents prototype components (CSS, JS, HTML) with Django refactoring notes (`<!-- DJANGO: ... -->`) and i18n markers (`<!-- i18n: key -->`)
- CSS/JS from prototype → `static/` in Django; HTML → Django templates with block inheritance

---

## 🏛️ Project Philosophy & Architecture Laws

### Clean Root Directory Principle
The project root is a **Control Panel**, not a junk drawer:
- ✅ **Allowed:** `src/` (apps), `deploy/` (DevOps), `docs/` (Twin Realms), `scripts/` (utils), `pyproject.toml`, `.env`
- ❌ **Forbidden:** Raw Python files (`bot.py`, `main.py`, `utils.py`), log folders, cache directories

### Monorepo Strategy (`src/`)
Divide into logical applications sharing infrastructure:
```
src/
├── prototype/     # Frontend (current: vanilla JS/HTML/CSS)
├── backend/       # API Server (Django planned)
├── bot/           # Telegram Client (if added)
├── core/          # Shared infrastructure (Logger, Config)
└── shared/        # Pure utilities only—NO business logic
```

**⚠️ The "Shared" Trap Rule:** `src/shared/` must contain ONLY utilities (`DateFormatter`, `StatusEnum`), never business logic (`UserService`, `GameLogic`). This prevents module coupling.

### Domain Architecture (Vertical Slices)
We build the system from **Independent Modules** (Domains/Components).

**The Isolation Rule (Закон Изоляции):**
Module A (e.g., `Inventory`) **MUST NOT** directly import code from Module B (e.g., `Stats`).
- ❌ Bad: `from domains.stats import service` inside inventory
- ✅ Why: Kills modularity and creates tight coupling

**The Bridge Pattern (Связь модулей) - 3 ways to communicate:**
1. **Internal Contracts (Interfaces):**
   - Module provides clean interface in `internal/` or `contracts/` folder
   - Other modules depend only on interface (DTO), not implementation

2. **Dispatcher / Event Bus:**
   - `Inventory` emits event `ItemEquipped`
   - `Stats` listens and updates. (Async communication)

3. **Orchestrator (Mediator):**
   - External service (above domains) calls `Inventory.equip()` then `Stats.recalc()`

### Documentation: Twin Realms
**Structure:** Папка `docs/` строится по этим направлениям:
- `architecture/en/` - Technical Truth: Contracts, DTO schemas, Mermaid diagrams (for AI code generation)
- `architecture/ru/` - Architect's Mind: "Why" decisions, mental maps, data flows (for understanding)
- `design/` - Visual rules, layout, animations
- `meta/` - Project setup, navigation standards

**Navigation Standard:**
Every MD-file has breadcrumbs at the top:
```
[⬅️ Back](../README.md) | [🏠 Root](/docs/README.md)
```
Index files (README.md) contain a navigation table with links to child content.

---

## �🏗️ Critical Architecture
### Code Philosophy & Stack
**Golden Rule:** **Framework-Native-First.** Seek solutions in FastAPI/Pydantic first, then write custom code.

**Python Architecture:**
- **Package Manager:** Poetry (manages `pyproject.toml`)
- **Backend (Planned):** FastAPI (Strictly Async), JWT/OAuth2, Pydantic V2 (Strict types + Field validators)
- **Config:** Pydantic Settings - all configurations as typed classes, loaded from `.env`
- **Data Layer:** PostgreSQL + SQLAlchemy 2.0+ Async + Alembic migrations
- **Cache & State:** Redis (not just caching, but State Management - sessions, FSM, battle states)
- **Async Tasks:** Arq (Redis-based task queue)

**Code Style:**
- Layered: API → Orchestrator → Service → Repository
- Strict OOP: Inheritance, encapsulation, Type Hinting (Python 3.13+)
- Libs over Boilerplate: Use `Rich`, `Loguru`, `Tabulate` instead of reinventing
### Monolithic CSS + Vanilla JS Architecture (Frontend)
This is **not** a framework project. No build step, no node_modules, no React/Vue.

**CSS Strategy:**
- Single monolithic sheet with CSS variables (`:root` scoped): [src/prototype/css/base.css](src/prototype/css/base.css)
- **Key color vars:** `--color-void` (#0F0F1A), `--color-monolith` (#1E1E2F), `--color-gold` (#FFD43B), `--color-blue` (#306998)
- Layout abstraction: fixed-positioned `.layout-header` (10vh), `.layout-footer` (5vh), `.slides-container`
- **Max-width constraint:** `var(--max-width): 1600px` (applies to all fixed elements via `left: 50%` + `transform: translateX(-50%)`)
- Adaptive breakpoint: **768px** triggers mobile burger menu ([src/prototype/css/base-adaptive.css](src/prototype/css/base-adaptive.css))

**JavaScript Strategy (No frameworks):**
- DOMContentLoaded event triggers initialization chains: hero animation → slide setup → event listeners
- **Two-slide system** managed by `goToSlide(index, direction)` in [src/prototype/js/main.js](src/prototype/js/main.js): Slide 0 = Hero, Slide 1 = Bento grid
- **Wheel event handler:** `handleWheel()` with 800ms cooldown (`SLIDE_COOLDOWN`) to prevent rapid switching
- **Session storage:** Hero animation plays once per session via `SESSION_KEY = 'codex_intro_shown'`
- **Mobile burger menu:** Triggered by `toggleMainMenu()` in [src/prototype/js/base.js](src/prototype/js/base.js)

**Global Files:**
- [index.html](index.html): Main page template (hero + bento grid)
- [src/prototype/js/main.js](src/prototype/js/main.js): Slide logic, boot sequence, module tab management
- [src/prototype/js/base.js](src/prototype/js/base.js): Header logo typing animation, mobile menu

### Multi-Page Navigation Model
Portfolio has **separate HTML pages** for different sections (not SPA routes):
- [index.html](index.html): Home + Bento grid
- [src/prototype/portfolio.html](src/prototype/portfolio.html): Portfolio with **tab-based file explorer** UI ([src/prototype/js/portfolio.js](src/prototype/js/portfolio.js))
- [src/prototype/experience.html](src/prototype/experience.html): Experience/timeline
- [src/prototype/contact.html](src/prototype/contact.html): Contact form

**Navigation Pattern:** Header nav links point to these pages using file paths (e.g., `href="src/prototype/portfolio.html"`). Each page reuses header/footer from global CSS and base.js.

### Logo Animation & Header Branding
The header logo undergoes a **sequence transformation**:
1. Page load: Displays `CodexDLC` (abbreviated with color-coded letters: D=gold, L=ivory, C=blue)
2. **After 3 seconds on desktop / 1.5 seconds on mobile:** Logo fades, then replaced with typing animation of `[ Developer's Life Cycle ]`
3. **Typing speed:** 50ms per char (desktop), 30ms per char (mobile)
4. **Colors in slogan:** `[ ` = ghost, `Developer's` = gold, `Life` = ivory, `Cycle` = blue, ` ]` = ghost
5. **Session storage:** Hero animation plays once per session (stored in `sessionStorage` under key `'codex_intro_shown'`); on subsequent page reloads within same session, animation is skipped

See [src/prototype/js/base.js](src/prototype/js/base.js) lines 8-60 for `typeSlogan()` implementation and lines 427-432 for sessionStorage check.

---

## 🛠️ Developer Workflows

### Setup & Running
```bash
# Install Python deps (Poetry handles venv)
poetry install

# Run management menu (generates project structure)
python manage.py

# To generate project_structure.txt file
python scripts/generate_project_tree.py
```

No Node.js build step—work directly with HTML/CSS/JS files.

### CSS Updates Workflow
1. Edit [src/prototype/css/base.css](src/prototype/css/base.css) for global styles (colors, layout)
2. Edit [src/prototype/css/components.css](src/prototype/css/components.css) for reusable UI components
3. Edit [src/prototype/css/main.css](src/prototype/css/main.css) for homepage-specific styles
4. **Always:** Update `:root` vars if adding colors; use `var(--name)` for any magic numbers that might change
5. **Test:** Refresh browser at 1920px (desktop), 768px (mobile breakpoint), 480px (small mobile)

**Key Layout Pattern:**
```css
/* Fixed container (header, footer, main sections) */
.layout-header {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: var(--max-width);
}
```

### JavaScript Event Pattern
All interactivity uses vanilla event listeners in `DOMContentLoaded`:

```javascript
document.addEventListener("DOMContentLoaded", () => {
    // Grab DOM elements once
    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Attach wheel listener
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Attach nav click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', () => { /* ... */ });
    });
});
```

### Multi-Page Asset Pattern
Each page (portfolio.html, experience.html, contact.html) includes:
```html
<link rel="stylesheet" href="../../src/prototype/css/base.css">
<link rel="stylesheet" href="../../src/prototype/css/components.css">
<script src="../../src/prototype/js/base.js"></script>
<script src="../../src/prototype/js/portfolio.js"></script> <!-- page-specific -->
```

Use relative paths from the page's location (e.g., `src/prototype/portfolio.html` needs `../../` to reach root).

---

## � DevOps & Infrastructure

### Configuration & Tooling
- **Package Manager:** Poetry (`pyproject.toml` single source of truth)
- **Config Management:** Pydantic Settings (all configs are typed classes)
- **Environment:** `.env` (in gitignore) + `.env.example` (in repo, no secrets)
- **Containerization:** Docker Compose (separate `dev` / `prod` configs)
- **Proxy:** Nginx (Reverse Proxy, Static files serving)
- **CI/CD:** GitHub Actions (Build → Test → Deploy)

### Data Layer Strategy
**API/Service Layer Separation:**
- Models live in `infrastructure/database/models` (centralized) or within domains (full isolation)
- Services ONLY work through Repositories (no direct `session.execute()` calls)
- DTOs (Pydantic schemas) carry data between layers, not ORM objects
- Migrations via Alembic

### Testing Philosophy
- **Unit Tests:** Live INSIDE modules (`src/domains/feature/tests/`)
  - Test pure logic without database (Mock Repositories)
- **E2E / Integration:** Live at PROJECT ROOT (`tests/`)
  - Use real database (Docker TestContainers)
  - Test API/flows end-to-end

---

## �📋 Key Patterns & Conventions

### Slide System Pattern (main.js)
```javascript
// Config constants at top of DOMContentLoaded
const SESSION_KEY = 'codex_intro_shown';
const SLIDE_COOLDOWN = 800; // ms

// State variables
let currentSlide = 0;
let isSliding = false;
let lastSlideTime = 0;

// Main transition function
function goToSlide(index, direction = 'down') {
    if (now - lastSlideTime < SLIDE_COOLDOWN) return; // Prevent flicker
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'hidden-up', 'hidden-down');
        if (i === index) slide.classList.add('active');
        else if (i < index) slide.classList.add('hidden-up');
        else slide.classList.add('hidden-down');
    });
    
    setTimeout(() => { isSliding = false; }, 600); // Match CSS transition duration
}
```

**Critical:** Always respect `SLIDE_COOLDOWN` and `isSliding` flag—they prevent animation conflicts.

### Tab Switching Pattern (portfolio.js)
Portfolio page uses a **tab map** to manage file explorer UI:
```javascript
const tabMap = {
    '#business': { id: 'business', index: 0, dna: 'business', category: 'CLIENTS' },
    '#eco': { id: 'eco', index: 1, dna: 'ecosystem', category: 'PRODUCTS' },
    // ...
};

// Updates both tab state AND data-active-dna attribute (used for visual DNA theming)
function updateDNAAndBreadcrumb(targetId) {
    const data = tabMap[targetId];
    tabsBar.setAttribute('data-active-dna', data.dna);
    breadcrumbCategory.textContent = data.category;
}
```

**Key insight:** The `data-active-dna` attribute controls CSS theming per section. Changing it triggers color scheme updates via CSS `[data-active-dna="..."]` selectors.

### Logo Typing Animation Pattern (base.js)
The slogan animation delays then types out with color spans:
```javascript
const parts = [
    { text: "[ ", color: "var(--color-ghost)" },
    { text: "Developer's", color: "var(--color-gold)" },
    // ...
];

// Uses a recursive interval to type each part char-by-char
function startTyping() {
    function typeNextPart() {
        if (partIndex >= parts.length) return;
        const part = parts[partIndex];
        const span = document.createElement('span');
        span.style.color = part.color;
        // Type character by character...
    }
}
```

**Key:** Uses `setTimeout` + inline `setInterval` to control timing precisely per character and per color part.

---

## 🔗 Integration Points

### External Dependencies
- **Google Fonts** (Inter, JetBrains Mono): Loaded in `<head>` of [index.html](index.html)
- **No npm packages or build tools**
- **No frameworks** (vanilla HTML/CSS/JS only)

### Django Backend (Future)
Planned migration path:
- Future: Django will handle URL routing, context data, and server-side rendering
- Static assets will be served from `src/prototype/` and `assets/`
- **Philosophy:** Framework-Native-First—leverage Django's ORM, forms, and admin before adding custom solutions

### Documentation Structure: Twin Realms & Breadcrumbs
All docs follow **Hub-and-Leaf model**:
- `README.md` files = hubs (index of child content with breadcrumbs)
- Content files = leaves (specific topics, links back to parent hub)
- Every file has breadcrumbs: `[⬅️ Back](../README.md) | [🏠 Root](../../README.md)`
- **Twin Realms:** Separate EN (specs/diagrams) and RU (architecture context) docs in `docs/architecture/`
  - EN realm: DTO schemas, Mermaid diagrams, technical contracts (for code generation)
  - RU realm: "Why" decisions, mental maps, flow explanations (easier for humans)

---

## ⚠️ Common Pitfalls

1. **CSS Variable Scoping:** Don't hardcode colors—use `:root` vars. Changes in one place affect entire site.
2. **Fixed Positioning Pattern:** All `.layout-*` elements use `left: 50% + transform: translateX(-50%)` for centering. Don't break this—it's fundamental to responsive design.
3. **Slide Cooldown:** If you modify `SLIDE_COOLDOWN` or `isSliding` logic, test rapid scrolling. Too-short cooldowns cause animation stutter.
4. **Mobile Testing:** Always test at 768px and below. Burger menu should appear. Tab widths should stack vertically.
5. **Relative Paths:** Sub-pages (portfolio.html, etc.) use `../../` paths. Verify paths when moving files.
6. **Session Storage:** Hero animation checks `sessionStorage.getItem('codex_intro_shown')`. Don't bypass—it prevents re-animating on reload.

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| [src/prototype/css/base.css](src/prototype/css/base.css) | Global colors, layout structure, `:root` vars |
| [src/prototype/css/main.css](src/prototype/css/main.css) | Homepage-specific styles (hero, bento grid) |
| [src/prototype/js/main.js](src/prototype/js/main.js) | Slide system, boot sequence, module tabs |
| [src/prototype/js/base.js](src/prototype/js/base.js) | Header logo animation, mobile menu |
| [src/prototype/js/portfolio.js](src/prototype/js/portfolio.js) | Tab switching, DNA theming, file explorer UI |
| [docs/design/01_identity.md](docs/design/01_identity.md) | Visual identity, color palette |
| [docs/design/02_layout_grid.md](docs/design/02_layout_grid.md) | Bento grid, layout rules |
| [docs/design/04_page_flow.md](docs/design/04_page_flow.md) | Navigation flows, animations |

---

## 🌍 Internationalization (i18n) Strategy

**Languages:** EN (default), RU, DE — LTR only for now

**Architecture:**
- **Backend (Django):** gettext + `.po` files in `locale/en/`, `locale/ru/`, `locale/de/`
  - Shebang `{% load i18n %}` in templates, `{% trans "nav_home" %}` syntax
  - Python code uses `from django.utils.translation import gettext_lazy as _`
- **Frontend (Vanilla JS):** JSON files in `static/i18n/en.json`, `ru.json`, `de.json`
  - Current language passed via `<script>const CURRENT_LANG = "{{ LANGUAGE_CODE }}";</script>`
  - Helper function: `function t(key) { return translations[key] || key; }`

**Language Selection (Priority):**
1. Browser `Accept-Language` header → Django middleware auto-selects closest match (EN/RU/DE)
2. Fallback: EN

**Key Locations:**
- `docs/architecture/en/templates/I18N_KEYS.md` — master list of all translation keys
- `docs/architecture/en/templates/I18N_BEST_PRACTICE.md` — detailed architecture & workflow
- All prototype code is marked with `<!-- i18n: key_name -->` comments for migration

---

## 📁 Architecture: Prototype → Django Migration

**Prototype Structure (`src/prototype/`):**
- Experimental sandbox for UI/UX testing before Django
- Deploys to GitHub Pages subdomain (e.g., `prototype.codexdlc.github.io`) as "Before" reference
- **Not a final product** — exists for:
  - Component experimentation
  - CSS/JS validation
  - Django template design documentation

**Documentation Structure (`docs/architecture/en/templates/`):**
- **CSS/** — CSS variables, component structure, responsive breakpoints
  - Source: [src/prototype/css/](src/prototype/css/) files
  - Includes `<!-- DJANGO: ... -->` comments for future optimizations
- **JavaScript/** — Module descriptions, DOMContentLoaded patterns, state management
  - Source: [src/prototype/js/](src/prototype/js/) files
  - Marked with `// i18n: key` for translation points
- **HTML/** — Base template structure, inheritance hierarchy, context variables
  - Example: `base.html` with `{% block header %}`, `{% block content %}`
  - Django template block patterns for all pages

**Migration Path:**
1. CSS/JS → Copy to Django `static/css/` and `static/js/`
2. HTML → Refactor to Django templates with `{% extends "base.html" %}`
3. Text → Extract to i18n keys (`.po` files and JSON)
4. Replace hardcoded data with Django context variables
