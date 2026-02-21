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

// ── CORS ──────────────────────────────────────────────────────────────────────
// FRONTEND_URL is set in Railway/Vercel env vars.
// Falls back to localhost for local development.
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:4173',
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (curl, Postman, Railway health checks)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Return false (not an Error) — cors middleware omits the ACAO header,
        // the browser blocks the request, and we don't leak origin strings or trigger a 500.
        console.warn(`CORS blocked origin: ${origin}`);
        callback(null, false);
    },
    credentials: true,
}));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
// Used by Railway to verify the container is healthy before routing traffic.
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Legacy alias — keep so any existing monitors/docs still work
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// ── Task CRUD Routes ──────────────────────────────────────────────────────────
app.get('/api/tasks', TaskController.getAllTasks);
app.get('/api/tasks/:id', TaskController.getTaskById);
app.post('/api/tasks', TaskController.createTask);
app.put('/api/tasks/:id', TaskController.updateTask);
app.delete('/api/tasks/:id', TaskController.deleteTask);

// ── Chatbot Route ─────────────────────────────────────────────────────────────
app.post('/api/chatbot', ChatbotController.processMessage);

// ── Error Handling (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ── Start server first, then connect DB asynchronously ───────────────────────
app.listen(PORT, () => {
    console.log(`🚀  Server listening on port ${PORT}`);
    console.log(`    Allowed origins: ${allowedOrigins.join(', ')}`);
});

const startDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        // sync() with no options creates missing tables but never modifies or drops
        // existing ones. This is safe for initial deployments on an empty database.
        //
        // ⚠️  DO NOT use { alter: true } or { force: true } in production:
        //   - alter: true can cause timeouts and unexpected column changes on large tables.
        //   - force: true drops and recreates every table (data loss).
        //
        // TODO: Replace with Sequelize CLI migrations for production schema changes:
        //   npx sequelize-cli db:migrate
        await sequelize.sync();
        console.log('✅  Database connected and schema synced.');
    } catch (error) {
        console.error('❌  Database connection failed. Server is still running.');
        console.error('    Reason:', (error as Error).message);
    }
};

startDB();