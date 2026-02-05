# 📄 Visual DNA & Motion

[⬅️ Back](./README.md) | [🏠 Docs Root](../../README.md)

## 🎯 Description

This document describes the "Living Visual Language" (Visual DNA). We don't use the same animations for everything. Each project type has its own unique character of motion and visual feedback.

## 1. "Living Cards" Philosophy

The user should distinguish project types not only by tags but also on a subconscious level — through background dynamics, animation speed, and glow type.

* **Principle:** Animation is part of navigation.
* **Implementation:**
  * *Stage 1 (CSS Prototype):* Gradients, static patterns, `box-shadow`.
  * *Stage 2 (Canvas/WebGL):* Interactive particles, shaders, parallax.

## 2. DNA Typology (The 3 DNA Types)

### 🏆 TYPE A: BUSINESS (Gold DNA)

Used for flagship products, ERP systems, and Enterprise solutions.

* **Metaphor:** Structure, Monolith, Gold, Stability.
* **Keywords:** `Solid`, `Structure`, `Heavy`, `Premium`.
* **Color Code:** `Python Gold (#FFD43B)` + Deep Black.
* **Visual Patterns:**
  * Geometric grids (Grid).
  * Clear lines forming shapes (cubes, polygons).
  * Slow, "heavy" movement (like opening a safe).
* **CSS Effect (MVP):** Dark background + Gold static glow at the bottom (`box-shadow`) + Barely visible grid in the background.

### ⚡ TYPE B: ECOSYSTEM (Blue DNA)

Used for bots, APIs, microservices, and network tools.

* **Metaphor:** Flow, Network, Electricity, Connections.
* **Keywords:** `Flow`, `Connection`, `Fast`, `Liquid`.
* **Color Code:** `Python Blue (#306998)` + Cyan accents.
* **Visual Patterns:**
  * Constellations — dots connected by lines.
  * Data Streams.
  * Smooth, "fluid" movement.
* **CSS Effect (MVP):** Blue "neon" glow + "Microchip" pattern or dots.

### 🧪 TYPE C: R&D LABS (Ghost/Green DNA)

Used for experiments, scripts, parsers, and AI.

* **Metaphor:** Terminal, Code, Glitch, Instability.
* **Keywords:** `Raw`, `Code`, `Glitch`, `Terminal`.
* **Color Code:** `Ghost Gray` / `Terminal Green`.
* **Visual Patterns:**
  * Monospaced text, running lines.
  * Glitch effect, RGB channel shift.
  * Cursor blinking.
* **CSS Effect (MVP):** Dashed border + "Scanline" effect (monitor stripes) + Dim greenish glow.

## 3. Transition Rules

### Hover Effects

On card hover:

1. **Business:** Scale increases, border becomes bright gold. Feeling of weight.
2. **Ecosystem:** Particle/background movement accelerates. Feeling of energy.
3. **R&D:** Short "glitch" or color inversion occurs. Feeling of digital nature.

### Page Transition (Hero Animation)

When navigating into a project:

* The card background expands to full screen, preserving its "DNA".
* *Example:* If Business was clicked, the new page header will have a gold grid.

---

> **Next:** [Experience Evolution](./experience_evolution.md)
