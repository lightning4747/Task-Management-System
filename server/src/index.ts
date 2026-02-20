import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/connection.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// ── Controllers ───────────────────────────────────────────────────────────────
import TaskController from './controllers/taskController.js';
import ChatbotController from './controllers/chatbotController.js';

const app = express();
const PORT = process.env.PORT || 8000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'Server is running ✅' });
});

// ── Task CRUD Routes ──────────────────────────────────────────────────────────
// GET    /api/tasks        → fetch all tasks
app.get('/api/tasks', TaskController.getAllTasks);

// POST   /api/tasks        → create a task (default status: 'New')
app.post('/api/tasks', TaskController.createTask);

// PUT    /api/tasks/:id    → update title / description / status
app.put('/api/tasks/:id', TaskController.updateTask);

// DELETE /api/tasks/:id   → remove a task
app.delete('/api/tasks/:id', TaskController.deleteTask);

// ── Chatbot Route ─────────────────────────────────────────────────────────────
// POST   /api/chatbot      → { message: "move 3 to In Progress" }
app.post('/api/chatbot', ChatbotController.processMessage);

// ── Error Handling (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server FIRST, then connect DB in background ────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  Server listening on http://localhost:${PORT}`);
    console.log('');
    console.log('  Available routes:');
    console.log(`  GET    http://localhost:${PORT}/api/tasks`);
    console.log(`  POST   http://localhost:${PORT}/api/tasks`);
    console.log(`  PUT    http://localhost:${PORT}/api/tasks/:id`);
    console.log(`  DELETE http://localhost:${PORT}/api/tasks/:id`);
    console.log(`  POST   http://localhost:${PORT}/api/chatbot`);
    console.log('');
});

const startDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false }); // force: false → never drop existing tables
        console.log('✅  Database connected and synced.');
    } catch (error) {
        console.error('❌  Database connection failed. Server is still running.');
        console.error('    Reason:', (error as Error).message);
    }
};

startDB();