# Frontend Guide — Kanban Task Management

This document outlines the component architecture, shared TypeScript types, and data-fetching patterns for the React client.

---

## Shared TypeScript Interfaces

```ts
// common types for frontend and backend

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
  createdAt: string;
  updatedAt: string;
}

export interface IChatbotResponse {
  message: string;
}
```

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

**Responsibility:** Fetch all tasks on mount and distribute them to columns.

```tsx
const fetchTasks = async () => {
  const res = await fetch('http://localhost:8000/api/tasks');
  const data: ITask[] = await res.json();
  setTasks(data);
};
```

### `Chatbot.tsx` — Floating Chat Interface

**Responsibility:** Provide a text input for natural language commands.

```tsx
const sendMessage = async () => {
  if (!message.trim()) return;
  const res = await fetch('http://localhost:8000/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data: IChatbotResponse = await res.json();
  setReply(data.message);
  
  // If the message indicates a success move, refresh the board
  if (data.message.includes("moved to")) {
    onTaskChange();
  }
  setMessage('');
};
```

---

## API Base URL

The backend runs on `http://localhost:8000`. Ensure your frontend environment variables are configured correctly.

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Development Tips

- **Task IDs:** When using the chatbot, use the numeric ID visible on the task card or in the console.
- **Status Updates:** The board should refresh after any successful `PUT` or `POST` operation to ensure consistency.
- **Error Handling:** Always check the `error` field in the response when the status code is not 2xx.