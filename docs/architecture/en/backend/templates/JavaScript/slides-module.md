# 📜 Slides Module (Navigation & State Management)

[⬅️ Back](../README.md) | [🏠 Root](/docs/README.md)

##

## 🎯 Описание

Кратко: модуль управления слайдами и навигацией в прототипе — отвечает за
переходы между Hero и
Bento-grid, обработку колесика мыши, тайминги анимаций и таб-систему на странице
портфолио.

<!-- i18n: module_slides_description -->

##

## 🗺️ Структура (Файлы и цели)

- **Source:** [src/prototype/js/main.js](../../../src/prototype/js/main.js)

- **Purpose:** Управление переходами между слайдами, cooldown, табы портфолио.

- **Контракт:** `#slide-hero`, `#slide-bento`, классы `active|hidden-up|hidden-
  down`, `data-tab`,
  `data-active-dna`.

##

## Overview

The **Slides Module** manages:

- Two-slide system (Hero + Bento Grid)

- Slide transitions with animations

- Wheel event handling with cooldown

- Slide state management

- Module tab system (for portfolio page)

##

## Slide System Architecture

### Slides Structure

```html
<!-- Slide 0: Hero -->
<div id="slide-hero" class="slide active">
    <h1>Welcome to CodexDLC</h1>
    <!-- Hero content -->
</div>

<!-- Slide 1: Bento Grid -->
<div id="slide-bento" class="slide hidden-down">
    <div class="bento-card"><!-- Card 1 --></div>
    <div class="bento-card"><!-- Card 2 --></div>
    <!-- More cards -->
</div>

```

### State Variables

```javascript
let currentSlide = 0;           // Current active slide (0 or 1)
let isSliding = false;          // Animation lock (prevent overlapping)
let lastSlideTime = 0;          // Timestamp of last slide change
const SLIDE_COOLDOWN = 800;     // ms between slide changes

```

##

## Main Slide Function: `goToSlide()`

```javascript
function goToSlide(index, direction = 'down') {
    // Cooldown check: prevent rapid switching
    const now = Date.now();
    if (now - lastSlideTime < SLIDE_COOLDOWN) {
        return;  // Ignore if too soon
    }

    // Bounds check
    if (index < 0 || index >= slides.length) {
        return;
    }

    // Prevent double-animation
    if (isSliding) {
        return;
    }

    isSliding = true;
    lastSlideTime = now;

    // Remove all animation classes
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'hidden-up', 'hidden-down');
    });

    // Apply new classes based on direction
    slides.forEach((slide, i) => {
        if (i === index) {
            // Target slide: show
            slide.classList.add('active');
        } else if (i < index) {
            // Slides above: hide up
            slide.classList.add('hidden-up');
        } else {
            // Slides below: hide down
            slide.classList.add('hidden-down');
        }
    });

    currentSlide = index;

    // Release lock after animation completes (600ms matches CSS transition)
    setTimeout(() => {
        isSliding = false;
    }, 600);
}

```

**CSS Classes & Transitions:**

```css
.slide {
    transition: all 600ms ease;
    opacity: 0;
    transform: translateY(100%);
}

.slide.active {
    opacity: 1;
    transform: translateY(0);
    z-index: 20;
}

.slide.hidden-up {
    transform: translateY(-100%);
    z-index: 5;
}

.slide.hidden-down {
    transform: translateY(100%);
    z-index: 5;
}

```

<!-- DJANGO: Slide transitions could migrate to URL-based navigation (/portfolio, /experience) -->
<!-- TODO: Add keyboard navigation (arrow keys for slide switching) -->

##

## Wheel Event Handler

```javascript
function handleWheel(event) {
    // Prevent browser zoom
    if (event.ctrlKey) {
        return;
    }

    // Prevent default scroll
    event.preventDefault();

    // Determine direction
    const direction = event.deltaY > 0 ? 'down' : 'up';

    // Calculate next slide
    let nextSlide = currentSlide;
    if (direction === 'down' && currentSlide < slides.length - 1) {
        nextSlide = currentSlide + 1;
    } else if (direction === 'up' && currentSlide > 0) {
        nextSlide = currentSlide - 1;
    }

    // Transition
    if (nextSlide !== currentSlide) {
        goToSlide(nextSlide, direction);
    }
}

// Attach listener (passive: false because we call preventDefault)
window.addEventListener('wheel', handleWheel, { passive: false });

```

**Cooldown Mechanism:**

- User scrolls down → Slide transition starts

- `isSliding` set to `true` (lock)

- Animation runs (600ms)

- After 600ms → `isSliding` set to `false`

- Cooldown timer (`SLIDE_COOLDOWN = 800ms`) ensures minimum gap between slides

- User can scroll again after 800ms

<!-- DJANGO: Wheel scrolling could be replaced with AJAX pagination or view-based navigation -->
<!-- TODO: Add touchpad/mobile swipe support for slide navigation -->

##

## Module Tab System (Portfolio Page)

For pages with multiple sections (like portfolio), a tab map manages state:

```javascript
const tabMap = {
    '#business': {
        id: 'business',
        index: 0,
        dna: 'business',
        category: 'CLIENTS'
    },
    '#eco': {
        id: 'eco',
        index: 1,
        dna: 'ecosystem',
        category: 'PRODUCTS'
    },
    // ... more tabs
};

function updateDNAAndBreadcrumb(targetId) {
    const data = tabMap[targetId];
    if (!data) return;

    // Update visual DNA (controls color scheme)
    tabsBar.setAttribute('data-active-dna', data.dna);

    // Update breadcrumb
    breadcrumbCategory.textContent = data.category;
}

// Listen for tab clicks
document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const tabId = e.target.getAttribute('data-tab');
        updateDNAAndBreadcrumb(tabId);
    });
});

```

**Visual DNA Theming:**

- Each section has a `data-active-dna` attribute

- CSS uses `:root[data-active-dna="business"]` selectors to change colors

- Example: Business DNA uses gold accents, Ecosystem DNA uses blue

<!-- i18n: tab_business -->
<!-- i18n: tab_ecosystem -->
<!-- i18n: tab_tech -->
<!-- i18n: tab_research -->

<!-- DJANGO: Tab content could come from Django views with different color contexts -->
<!-- TODO: Add URL hash support for direct tab links (#portfolio/business) -->

##

## Initialization Sequence

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache DOM elements
    const slides = document.querySelectorAll('.slide');
    const tabsBar = document.querySelector('.tabs-bar');

    // 2. Initialize slide system
    currentSlide = 0;
    isSliding = false;
    lastSlideTime = 0;

    // 3. Attach wheel listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    // 4. Initialize tab system (if exists)
    if (tabsBar) {
        setupTabSystem();
    }

    // 5. Initialize other modules (from base.js)
    // typeSlogan(), setupBurgerMenu(), etc.
});

```

##

## Performance Considerations

<!-- TODO: Use requestAnimationFrame() for smoother animations -->
<!-- TODO: Add touch support (swipe gestures on mobile) -->
<!-- TODO: Test animation performance on low-end devices -->
<!-- DJANGO: Consider server-side rendering slide content for better SEO -->

##

## i18n Integration

```javascript
// Tab labels (portfolio page)
// i18n: tab_business
// i18n: tab_ecosystem
// i18n: tab_tech
// i18n: tab_research

// Breadcrumb categories
// i18n: category_clients
// i18n: category_products
// i18n: category_services

```

