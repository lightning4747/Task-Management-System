import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/connection.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';

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

// ── API Routes ────────────────────────────────────────────────────────────────
app.use(routes);

// ── Error Handling (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server FIRST, then connect DB in background ────────────────────────
app.listen(PORT, () => {
    console.log(`🚀  Server listening on http://localhost:${PORT}`);
});

const startDB = async () => {
    try {
        await sequelize.authenticate();
        // force: false  → never drop existing tables
        await sequelize.sync({ force: false });
        console.log('✅  Database connected and synced.');
    } catch (error) {
        console.error('❌  Database connection failed. Server is still running.');
        console.error('    Reason:', (error as Error).message);
    }
};

startDB();