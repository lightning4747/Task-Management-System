# 📋 Kanban Task Management System

A full-stack Kanban board application with an integrated AI chatbot, built with a modern React frontend and Node.js/Express backend.

---
# update
Removed the deployment due to infra cost 🙏

## 🖼️ Screenshots

| Board View | Task Detail | Chatbot |
|:---:|:---:|:---:|
| ![Board View](./docs/screenshots/board.png) | ![Task Detail](./docs/screenshots/task-detail.png) | ![Chatbot](./docs/screenshots/chatbot.png) |

---

## 🛠️ Tech Stack

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide React" />
</p>

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

### Deployment & Infrastructure
<p align="left">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
</p>

---

## ✨ Features

- **Kanban Board** — Drag-and-drop task management across customizable columns
- **Task Management** — Create, view, update, and delete tasks with detailed information
- **AI Chatbot** — Built-in chatbot assistant powered by a custom Express controller
- **Theme Toggle** — Light/dark mode support
- **Task Drawer** — Slide-in panel for quick task previews
- **Responsive Design** — Mobile-friendly layout using Tailwind CSS

---

## 📁 Project Structure

```text
kanban-project/
├── client/                        # React frontend (Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddTaskModal.tsx   # Modal for creating tasks
│   │   │   ├── AddTaskPage.tsx    # Full-page task creation
│   │   │   ├── Board.tsx          # Main board container
│   │   │   ├── Chatbot.tsx        # AI chatbot component
│   │   │   ├── Column.tsx         # Individual Kanban column
│   │   │   ├── KanbanBoard.tsx    # Kanban board logic
│   │   │   ├── Layout.tsx         # App shell/layout
│   │   │   ├── TaskCard.tsx       # Task card UI
│   │   │   ├── TaskDetail.tsx     # Task detail view
│   │   │   ├── TaskDrawer.tsx     # Slide-in task drawer
│   │   │   └── ThemeToggle.tsx    # Dark/light mode toggle
│   │   ├── constants/
│   │   │   └── mockData.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── vercel.json
│   └── vite.config.ts
│
├── server/                        # Node.js + Express backend
│   └── src/
│       ├── config/
│       │   └── connection.ts      # Sequelize DB connection
│       ├── controllers/
│       │   ├── chatbotController.ts
│       │   └── taskController.ts
│       ├── middleware/
│       │   └── errorMiddleware.ts
│       ├── models/
│       │   ├── Task.ts
│       │   ├── index.ts
│       │   └── schema.sql
│       ├── routes/
│       │   └── api/
│       │       ├── chatbotRoutes.ts
│       │       ├── taskRoutes.ts
│       │       └── index.ts
│       ├── services/
│       │   ├── chatbotService.ts
│       │   └── taskService.ts
│       └── types/
│           └── index.ts
│
└── docs/                          # Project documentation
    ├── API_SPEC.md
    ├── BACKEND_SETUP.md
    ├── FRONTEND.md
    └── PROGRESS.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- MySQL database (or a [Railway](https://railway.app) hosted instance)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/lightning4747/Task-Management-System.git
cd Task-Management-System
```

### 2. Set Up the Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your database credentials:

```env
# ── Server ───────────────────────────────────────────
PORT=8000

# ── CORS ─────────────────────────────────────────────
FRONTEND_URL="YOUR_FRONTEND_URL"

# ── Railway MySQL (PUBLIC — works from your local machine) ────────────
# Use MYSQL_PUBLIC_URL locally. On Railway itself, MYSQL_URL (private) is used.
MYSQL_PUBLIC_URL=mysql://root:ARwpXwAxbXjVSrAbmgeXzFdigOlTpClG@maglev.proxy.rlwy.net:23734/railway

# ── These are set automatically inside Railway — leave blank locally ──
# MYSQL_URL=mysql://root:...@mysql.railway.internal:3306/railway

# ── Legacy local MySQL fallback (only used if all MYSQL_* are blank) ──
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=kanban_db
```

Run the server:

```bash
npm run dev
```

### 3. Set Up the Client

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL="YOUR_FRONTEND_URL"
```

Run the frontend:

```bash
npm run dev
```

The app will be available at https://task-management-system-blue-phi.vercel.app/tasks.

---

## 📡 API Overview

| Method | Endpoint | Description |
|:------:|----------|-------------|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| POST | `/api/chatbot` | Send a message to the AI chatbot |

> See [docs/API_SPEC.md](./docs/API_SPEC.md) for the full API specification.

---

## 🌐 Deployment

### Frontend — Vercel

The client is configured for deployment on Vercel via `client/vercel.json`. Connect your GitHub repo to Vercel and set the root directory to `client/`.

Set the following environment variable in the Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.com
```

### Backend — Railway (or any Node.js host)

Deploy the `server/` folder to Railway or any platform supporting Node.js. Set the required environment variables in the platform's settings.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/API_SPEC.md](./docs/API_SPEC.md) | Full REST API specification |
| [docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md) | Backend setup guide |
| [docs/FRONTEND.md](./docs/FRONTEND.md) | Frontend architecture notes |
| [docs/PROGRESS.md](./docs/PROGRESS.md) | Development progress log |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Contributors

Gurunesh M  
Vignesh T

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

