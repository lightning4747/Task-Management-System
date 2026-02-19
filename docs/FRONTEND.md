# Frontend Guide — Kanban Task Management

This document outlines the component architecture, shared TypeScript types, and data-fetching patterns for the React client. Read this before writing any components to ensure the frontend stays aligned with the backend API contract defined in `API_SPEC.md`.

---

## Shared TypeScript Interfaces

Store these definitions in **both** `client/src/types/index.ts` and `server/src/types/index.ts` so the frontend and backend always agree on the data shape.

```ts
// client/src/types/index.ts  (and server/src/types/index.ts)

export type TaskStatus =
  | 'New'
  | 'Ready for Implementation'
  | 'Assigned'
  | 'In Progress'
  | 'Moved to QA'
  | 'QA Failed'
  | 'QA Pass Ready for Stage';

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  updatedAt: string; // ISO 8601 date string, e.g. "2023-10-27T10:00:00Z"
}

export interface IChatbotResponse {
  reply: string;
  action: 'UPDATE_TASK' | 'CREATE_TASK' | 'DELETE_TASK' | null;
  taskId: number | null;
}
```

> **Why this matters:** If the backend changes a field name (e.g. `updatedAt` → `updated_at`), updating `ITask` in one shared file immediately surfaces TypeScript errors in every component that uses it — catching integration bugs before they hit the browser.

---

## Component Architecture

```
App.tsx
└── Board.tsx                  ← fetches all tasks; owns global task state
    ├── Column.tsx (×7)        ← one per status; renders filtered TaskCards
    │   └── TaskCard.tsx (×N)  ← individual task; handles move actions
    └── Chatbot.tsx            ← floating UI; sends commands; triggers refresh
```

### `Board.tsx` — Main Container

**Responsibility:** Fetch all tasks on mount and distribute them to columns. This is the single source of truth for task data.

```tsx
// client/src/components/Board.tsx
import { useEffect, useState } from 'react';
import { ITask, TaskStatus } from '../types';
import Column from './Column';
import Chatbot from './Chatbot';

const STATUSES: TaskStatus[] = [
  'New',
  'Ready for Implementation',
  'Assigned',
  'In Progress',
  'Moved to QA',
  'QA Failed',
  'QA Pass Ready for Stage',
];

export default function Board() {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/api/tasks');
    const data: ITask[] = await res.json();
    setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const moveTask = async (id: number, newStatus: TaskStatus) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks(); // re-fetch to keep UI in sync with DB
  };

  return (
    <div className="board-grid">
      {STATUSES.map(status => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter(t => t.status === status)}
          onMove={moveTask}
        />
      ))}
      <Chatbot onTaskChange={fetchTasks} />
    </div>
  );
}
```

---

### `Column.tsx` — Status Lane

**Responsibility:** Render a labelled column containing all `TaskCard` components for a given status. Applies CSS grid column styling.

```tsx
// client/src/components/Column.tsx
import { ITask, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface Props {
  status: TaskStatus;
  tasks: ITask[];
  onMove: (id: number, newStatus: TaskStatus) => void;
}

export default function Column({ status, tasks, onMove }: Props) {
  return (
    <div className="column">
      <h2 className="column-header">{status} ({tasks.length})</h2>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onMove={onMove} />
      ))}
    </div>
  );
}
```

---

### `TaskCard.tsx` — Individual Task

**Responsibility:** Display a single task and expose controls to move it to an adjacent stage. Use simple "Move Forward / Move Back" buttons as a baseline; drag-and-drop can be layered on later.

```tsx
// client/src/components/TaskCard.tsx
import { ITask, TaskStatus } from '../types';

const STATUS_ORDER: TaskStatus[] = [
  'New',
  'Ready for Implementation',
  'Assigned',
  'In Progress',
  'Moved to QA',
  'QA Failed',
  'QA Pass Ready for Stage',
];

interface Props {
  task: ITask;
  onMove: (id: number, newStatus: TaskStatus) => void;
}

export default function TaskCard({ task, onMove }: Props) {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const prevStatus = STATUS_ORDER[currentIndex - 1] ?? null;
  const nextStatus = STATUS_ORDER[currentIndex + 1] ?? null;

  return (
    <div className="task-card">
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <div className="task-actions">
        {prevStatus && (
          <button onClick={() => onMove(task.id, prevStatus)}>← Back</button>
        )}
        {nextStatus && (
          <button onClick={() => onMove(task.id, nextStatus)}>Forward →</button>
        )}
      </div>
    </div>
  );
}
```

---

### `Chatbot.tsx` — Floating Chat Interface

**Responsibility:** Provide a text input for natural language commands. On submit, call `POST /chatbot`. If the response `action` is not null (meaning a task was modified), call `onTaskChange()` to trigger a board refresh.

```tsx
// client/src/components/Chatbot.tsx
import { useState } from 'react';
import { IChatbotResponse } from '../types';

interface Props {
  onTaskChange: () => void;
}

export default function Chatbot({ onTaskChange }: Props) {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    const res = await fetch('http://localhost:5000/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data: IChatbotResponse = await res.json();
    setReply(data.reply);
    if (data.action !== null) {
      onTaskChange(); // a task changed — refresh the board
    }
    setMessage('');
  };

  return (
    <div className="chatbot">
      <div className="chatbot-reply">{reply}</div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder='Try: "move 3 to In Progress"'
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

---

## CSS Layout — 7-Column Grid

Add this to `App.css` or a dedicated `Board.css`:

```css
.board-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto; /* horizontal scroll on small screens */
  align-items: start;
}

.column {
  background: #f4f5f7;
  border-radius: 8px;
  padding: 0.75rem;
  min-height: 400px;
}

.column-header {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.task-card {
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}

.chatbot {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  width: 300px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

---

## Data Flow Summary

```
Board mounts
  → GET /tasks
  → setTasks(data)
  → renders 7 × Column, each filtering by status

User clicks "Forward →" on a TaskCard
  → Board.moveTask(id, newStatus)
  → PUT /tasks/:id
  → GET /tasks (re-fetch)
  → setTasks(fresh data)

User types in Chatbot and presses Enter
  → POST /chatbot { message }
  → if response.action !== null → GET /tasks (re-fetch)
```

---

## Development Tips

- **Use mock data first.** While the backend is being built, replace `fetchTasks()` with a local array of `ITask` objects that match the API contract exactly. This lets both developers work in parallel without blockers.
- **Environment variable for base URL.** Store `http://localhost:5000/api` in a `.env` file as `VITE_API_URL` so switching to a deployed backend only requires one change.
- **Loading and error states.** Add `isLoading` and `error` state fields to `Board.tsx` and show appropriate UI — the board should never silently fail.