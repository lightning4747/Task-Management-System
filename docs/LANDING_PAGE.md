# 📄 Project Update: Introduction Page implementation
**Inspiration:** Supabase (UI/UX) + Zoho Sprint (workflow)

**Status:** Design Phase / Draft

**Target Route:** `/`

**Purpose:** To provide a professional entry point for users before they jump into the mechanical Kanban board.

## 1. The Vision

The introduction page should act as a "Minimalist Gateway." Instead of landing directly into the complex grid of tasks, users will see a clean, high-contrast landing area that explains the **mechanical Kanban concept**.

### Key Design Pillars:

* **Minimalist Typography:** Bold headings using the project's system fonts.
* **The "Hangar" Preview:** A small, static visual representation of a task card "hooked" to a line, introducing the unique UI physics.
* **Theme Awareness:** Full support for the Dark/Light mode toggle we just implemented.

---

## 2. Layout Structure (The "LandingPage" Component)

We will implement a simple vertical stack:

1. **Hero Section:** * **Title:** "Task Management. Re-engineered."
* **Subtitle:** "A high-fidelity Kanban experience with physical feedback and integrated AI assistance."
* **Primary CTA:** A "Launch Board" button that navigates to `/tasks`.


2. **Feature Cards (3-Column):**
* **Physical DND:** Explaining the hangar-style drag-and-drop physics.
* **Command Console:** Highlighting the Chatbot's ability to move and delete tasks via CLI commands.
* **Real-time Sync:** Mentioning the event-driven architecture that keeps the board updated.

---

## 3. Implementation Plan for the Team

### Routing Changes

In `App.tsx`, we need to adjust the current routes:

```tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/tasks" element={<Board />}>
    <Route path=":id" element={<TaskDetail />} />
    <Route path="new" element={<AddTaskPage />} />
  </Route>
</Routes>

```
## 4. Next Steps

* [ ] Draft the `LandingPage.tsx` functional component.
* [ ] Extract common "Button" styles to `index.css` to ensure the CTA matches the "Create Task" button on the board.
* [ ] Add a "View on GitHub" link in the landing footer.

