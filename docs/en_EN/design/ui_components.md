# 📄 UI Components & Elements

[⬅️ Back](./README.md) | [🏠 Docs Root](../../README.md)

## 1. Typography & Text Blocks

Based on the contrast between system code and clean interface.

* **Slide Headings (Presentation H1):** Large size, Montserrat font. Often accompanied by a background ordinal number (e.g., `01`) in Ghost Gray color.
* **Mono-accents:** Use of JetBrains Mono for all technical details: library versions, file paths, links, and DLC decoding.
* **Quotes/Insights:** Blocks with a left border in Python Gold color to highlight key takeaways in the project history.

## 2. Buttons (Action Elements)

Button style should resemble elements of professional software or terminal.

### Primary (CTA)

* **Style:** Ghost-button (transparent background) with a gold `1px` border.
* **Text:** Uppercase, Python Gold color.
* **Hover:** Fill with Python Gold color, text becomes Space Navy.

### Tech-link

* **Style:** Text in square brackets, e.g., `[ View Source ]`.
* **Color:** Python Blue.
* **Usage:** Links to GitHub, documentation, prototypes on `codexdlc.dev`.

## 3. Bento Cards (Main Page)

Mosaic elements representing projects.

* **Visuals:** Full-screen background image (stylized screenshot or abstraction).
* **Overlay:** On hover, a gradient darkening smoothly appears from bottom to top.
* **Card Content:**
  * *Bottom Left Corner:* Project Name (Bold).
  * *Bottom Right Corner:* Tech tags (small Mono-font in gray bubbles).
  * *Top Right Corner:* Category Indicator (Business / Pet / Idea).

## 4. Split Cards (Project Header)

Two main interactive blocks at the top of the project page.

### A. "Prototype / Logic" Card (Left)

* **Border:** Dashed, mimicking a blueprint.
* **Color:** Main accent on Python Blue.
* **Elements:** Link to `*.codexdlc.dev`, Git branch icon, list of key prototype features.

### B. "Production / Reality" Card (Right)

* **Border:** Solid, confident.
* **Color:** Accent on Python Gold.
* **Elements:** Link to main domain, "Live" icon, brief result (e.g., "Deployed to AWS", "100+ users").

## 5. Presentation Modules (Slides)

Components for the lower part of the page.

* **Image Frame:** Stylized browser or terminal frame for screenshots.
* **Diagram Block:** Container for Mermaid.js schemes with dark background and `12px` rounding.
* **Split Slide:** "Text + Image" component in 40/60 proportion.

## 6. Decorative Element "DLC Decoder"

Special header component.

* **State 1 (Static):** `CodexDLC`.
* **State 2 (Active/Hover):** `Codex [ Developer’s Life Cycle ]`.
* **Animation:** Smooth "typing" of decoding text in terminal style.

---

> **Next:** [Page Flow](./page_flow.md)
