# API Specification — Kanban Task Management

**Base URL:** `http://localhost:5000/api`

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
    "updatedAt": "2023-10-27T10:00:00Z"
  }
]
```

---

### `POST /tasks`
Create a new task. The task is created with a default status of `"New"`.

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Success Response — `201 Created`:**
```json
{
  "id": 2,
  "title": "Build Login Page",
  "description": "Create the React login component",
  "status": "New",
  "updatedAt": "2023-10-28T09:00:00Z"
}
```

---

### `PUT /tasks/:id`
Update a task's status and/or title.

**URL Parameter:** `:id` — the integer ID of the task to update.

**Request Body:**
```json
{
  "status": "string",
  "title": "string (optional)"
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
  "updatedAt": "2023-10-28T11:30:00Z"
}
```

**Error Response — `404 Not Found`:**
```json
{ "error": "Task not found" }
```

**Error Response — `400 Bad Request`:**
```json
{ "error": "Invalid status value" }
```

---

### `DELETE /tasks/:id`
Delete a task permanently.

**URL Parameter:** `:id` — the integer ID of the task to delete.

**Request Body:** None

**Success Response — `200 OK`:**
```json
{ "message": "Task 2 deleted successfully" }
```

**Error Response — `404 Not Found`:**
```json
{ "error": "Task not found" }
```

---

### `POST /chatbot`
Send a natural language command to the chatbot engine. The bot parses the message and may perform a task operation.

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

**Success Response — `200 OK` (task was modified):**
```json
{
  "reply": "Task #12 moved to In Progress",
  "action": "UPDATE_TASK",
  "taskId": 12
}
```

**Success Response — `200 OK` (informational / no action taken):**
```json
{
  "reply": "Sorry, I didn't understand that command. Try: 'move [id] to [status]'",
  "action": null,
  "taskId": null
}
```

**Supported chatbot command patterns:**
- `"move [id] to [status]"` — Updates the task's status column.
- `"create task [title]"` — Creates a new task with a given title.
- `"delete task [id]"` — Deletes the specified task.

---

## Status Values

The `status` field is an ENUM. Only the following values are valid:

| Status | Meaning |
|---|---|
| `New` | Requirement not yet complete |
| `Ready for Implementation` | Requirement finalised |
| `Assigned` | Task assigned to a developer |
| `In Progress` | Development has started |
| `Moved to QA` | Ready for testing |
| `QA Failed` | Issues found during testing |
| `QA Pass Ready for Stage` | Approved after QA |

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
| `400` | Validation error (e.g. invalid status) |
| `404` | Resource not found |
| `500` | Internal server error |