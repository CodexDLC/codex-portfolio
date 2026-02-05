# 🧭 Documentation Standard

[⬅️ Back](./README.md) | [🏠 Docs Root](../../README.md)

> **RULE:** This project follows the **"English First"** documentation policy.

## 1. Philosophy

We maintain documentation in two languages to ensure international accessibility while keeping the local community engaged.

### 🇬🇧 English (Primary / Source of Truth)
*   **Mandatory for:** All Pull Requests.
*   **Location:** `docs/en_EN/` (mirrored folder structure).
*   **Content:** Full technical specifications, data schemas, code examples.
*   **Goal:** To be the single source of truth. If the code contradicts the EN docs, it is a bug.

### 🇷🇺 Russian (Secondary / Conceptual Hub)
*   **Optional for Contributors:** If you don't speak Russian, just write the EN docs. The repository maintainer will add the RU translation later.
*   **Location:** `docs/ru_RU/` (mirrored folder structure).
*   **Content:** Conceptual translation. We translate the *meaning* and *logic*, but avoid duplicating code blocks or schemas (we link to the EN version if they are identical).
*   **Goal:** To help Russian-speaking developers understand *how* and *why* the system works.

---

## 2. Navigation Standard

### Breadcrumbs
Every file **must** start with a navigation header:
`[⬅️ Back](./README.md) | [🏠 Docs Root](../../README.md)`

*   **Back:** Links to the current directory's `README.md`.
*   **Docs Root:** Links to the documentation root.

### Index Files (README.md)
Every directory must have a `README.md` acting as a hub.

**Structure:**
1.  **Header:** Icon 📂 + Section Name.
2.  **Navigation:** Breadcrumbs.
3.  **Description:** Short summary (2-3 lines).
4.  **Map:** List of files in a logical reading order (not alphabetical).

---

## 3. File Structure & Naming

*   **Filenames:** Use `snake_case` (e.g., `service_layer.md`).
*   **No Prefixes:** Do not use `01_`, `02_` prefixes in filenames. The reading order is defined in the `README.md` and through "Next" links within files.
*   **Language Folders:** All documents must reside strictly within `docs/en_EN/` or `docs/ru_RU/`.

---

## 4. Checklist for Contributors

1.  [ ] **Language:** I have written the documentation in English (in `docs/en_EN/`).
2.  [ ] **Navigation:** I have added breadcrumbs and a "Next" link (if it's part of a chain).
3.  [ ] **Index:** I have added a link to the new file in the corresponding folder's `README.md`.
