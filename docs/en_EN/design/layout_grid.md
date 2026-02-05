# 📄 Layout, Grid & Navigation

[⬅️ Back](./README.md) | [🏠 Docs Root](../../README.md)

## 1. Grid & Spacing

To implement the CodexDLC architectural style, a modular grid is used, providing "air" and logical positioning.

### Bento Grid (Main Page)

* **Mechanics:** 12-column grid. Project cards have different proportions (1x1, 2x1, 2x2).
* **Gap:** `24px` between modules.
* **Responsiveness:**
  * *Desktop:* Complex mosaic.
  * *Tablet:* Simplified grid.
  * *Mobile:* Vertical stack (see "Smart Accordion" section).

## 2. Header: Branding & Identity

The header serves not only for navigation but also for brand reinforcement.

* **Logo:** `CodexDLC`.
* **Decoding Effect:** In the header, under or next to the DLC abbreviation, the text `[ Developer’s Life Cycle ]` is displayed in small font (Mono) constantly or on hover.
* **Alternative Branding:** For personal or local projects, the variation `CodexEN` can be used (as a tribute to Energodar).
* **Navigation:** Compact links `[ Projects ]`, `[ Experience ]`, `[ Contact ]`.

## 3. Mobile Navigation: Smart Accordion

To avoid turning the mobile version into an endless list, accordion logic is used.

* **Sections:** Business Solutions / Pet Projects / Ideas.
* **Behavior:**
  * By default, all sections are collapsed into narrow horizontal strips.
  * Clicking on a strip expands it, showing the list of projects (Bento cards).
* **Focus Principle:** Only one section can be open at a time. When opening a new one, the old one smoothly collapses.

## 4. Project Page: The Triple Split

The project page is divided into logical zones: "Intro" (Prototype vs Production) and "Presentation".

### A. Upper Split Block (Intro Section)

The screen is divided into two independent panels at the top:

* **Left Panel (Prototype / Logic):**
  * *URL:* Link to subdomain (e.g., `project.codexdlc.dev`).
  * *Content:* Brief description of the idea, prototype task, link to repository.
* **Right Panel (Production / Reality):**
  * *URL:* Link to the real working project online or its official documentation.
  * *Content:* Current status, implementation result, external links.

### B. Lower Presentation Block (The Narrative)

Occupies the main area of the page below the upper split.

* **Format:** Vertical "slide presentation".
* **Content:** Deep description of the project. Text is integrated with images from diagrams and schemes.
* **Visuals:** Each stage (Architecture, Database, Frontend) is designed as a separate "slide" with large graphic elements, mimicking a PDF presentation.

## 5. Smart Footer

* **Composition:** Quick contacts, social media icons.
* **Decor:** Copyright in the style `CodexDLC © 2024 | Built with Python Logic`.

---

> **Next:** [UI Components](./ui_components.md)
