# API Specification — Kanban Task Management

**Base URL:** `http://localhost:8000/api`

All request and response bodies use `Content-Type: application/json`.

---

## Endpoints

### `GET /tasks`
Fetch all tasks for the board.

**Request Body:** None

**Success Response — `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "Setup Database",
    "description": "Install MySQL and run migrations",
    "status": "New",
    "createdAt": "2026-02-19T20:00:00Z",
    "updatedAt": "2026-02-19T20:00:00Z"
  }
]
```

---

### `GET /tasks/:id`
Fetch a single task by its ID.

**URL Parameter:** `:id` — the integer ID of the task.

**Success Response — `200 OK`:**
```json
{
  "id": 1,
  "title": "Setup Database",
  "description": "Install MySQL and run migrations",
  "status": "New",
  "createdAt": "2026-02-19T20:00:00Z",
  "updatedAt": "2026-02-19T20:00:00Z"
}
```

**Error Response — `404 Not Found`:**
```json
{ "error": "Task with id 1 not found" }
```

---

### `POST /tasks`
Create a new task. The task is created with a default status of `"New"`.

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)"
}
```

**Success Response — `201 Created`:**
```json
{
  "id": 2,
  "title": "Build Login Page",
  "description": "Create the React login component",
  "status": "New",
  "createdAt": "2026-02-20T09:00:00Z",
  "updatedAt": "2026-02-20T09:00:00Z"
}
```

---

### `PUT /tasks/:id`
Update a task's details or status.

**URL Parameter:** `:id` — the integer ID of the task to update.

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "string (optional)"
}
```

The `status` field must be one of the seven valid workflow stages (see [Status Values](#status-values)).

**Success Response — `200 OK`:**
```json
{
  "id": 2,
  "title": "Build Login Page",
  "description": "Create the React login component",
  "status": "In Progress",
  "updatedAt": "2026-02-20T11:30:00Z"
}
```

**Error Response — `404 Not Found`:**
```json
{ "error": "Task with id 2 not found" }
```

---

### `DELETE /tasks/:id`
Delete a task permanently.

**URL Parameter:** `:id` — the integer ID of the task to delete.

**Success Response — `200 OK`:**
```json
{ "message": "Task deleted successfully" }
```

**Error Response — `404 Not Found`:**
```json
{ "error": "Task with id 2 not found" }
```

---

### `POST /chatbot`
Send a natural language command to the chatbot.

**Request Body:**
```json
{
  "message": "string"
}
```

**Example Request:**
```json
{
  "message": "move 12 to In Progress"
}
```

**Success Response — `200 OK`:**
```json
{
  "message": "Task 12 moved to In Progress"
}
```

**Supported chatbot command patterns:**
- `"move [id] to [status]"` — Updates the task's status.

---

## Status Values

The `status` field is an ENUM. Only the following values are valid:

1. `New`
2. `Ready for Implementation`
3. `Assigned`
4. `In Progress`
5. `Moved to QA`
6. `QA Failed`
7. `QA Pass Ready for Stage`

---

## Error Handling

All error responses follow this shape:

```json
{ "error": "Human-readable error message" }
```

| HTTP Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Validation error / Bad request |
| `404` | Resource not found |
| `500` | Internal server error |