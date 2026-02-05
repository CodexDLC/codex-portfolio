# 📄 Page Flow & Transitions

[⬅️ Back](./README.md) | [🏠 Docs Root](../../README.md)

## 1. User Journey: Main → Project

The main goal is to make the transition from the Bento grid to the project seamless.

* **Trigger:** Click on a project card in the Bento Grid.
* **Animation (Hero Transition):**
  * The selected card expands to full screen, becoming the "background" for the upper project section.
  * Other Bento cards smoothly fade out (Opacity 0).
* **Result:** The user instantly finds themselves in the upper part of the "Triple Split" without losing visual context.

## 2. "Triple Split" Logic (Project Detail)

The upper part of the project page is an interactive hub.

### A. Interaction with Split Blocks (Header)

* **Rest State:** Left (Prototype) and Right (Production) panels are equal in width (50/50).
* **Hover Effect:** On hover over one of the panels, it slightly expands (e.g., to 60%), and the adjacent one narrows. This highlights the selected path.
* **Click:** Clicking on `[ Open Link ]` opens the corresponding URL (subdomain `codexdlc.dev` or main site) in a new tab.

### B. Transition to Presentation (Scroll Down)

* When scrolling down starts, the upper Split Block smoothly moves up or fixes as a narrow strip (Mini-header), giving way to the main presentation.

## 3. Presentation Flow (Slide Narrative)

The lower part of the page works on the principle of "vertical presentation".

* **Sticky Scroll:** On scroll, each subsequent slide (content block) can "float" over the previous one or smoothly appear.
* **Interactive Slides:**
  * Mermaid.js schemes are rendered when the slide enters the viewport.
  * If the slide contains code, it is highlighted (Syntax Highlighting) with a "typing" effect.

## 4. "Smart Accordion" Logic (Mobile)

Implementation of the idea for mobile devices to avoid "infinite slider".

* **Initial State:** 3 narrow strips (Business / Pet / Ideas).
* **Action:** Clicking on the strip header.
* **Behavior:**
  1. The active strip expands to screen height (minus the height of other strip headers).
  2. A vertical list of projects appears inside the strip.
  3. When clicking on another strip — the current one instantly collapses, and the new one opens.
* **Why:** This preserves structure and prevents the user from getting lost in scrolling a huge list.

## 5. Branding Animation (Header DLC Decoder)

* **On Page Load:** `CodexDLC` is displayed in the header.
* **After 1.5 seconds:** The letters `DLC` are smoothly replaced by `[ Developer’s Life Cycle ]` (typewriter effect).
* **On Scroll:** The text shrinks back to `CodexDLC` to save space.

---

> **Next:** [Content Map](./content_map.md)
