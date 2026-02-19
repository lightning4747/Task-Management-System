import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./config/connection.js";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// 1. Basic Health Check Route (Always works)
app.get("/api/health", (req, res) => {
    res.json({ status: "Server is running", database: "Attempting connection..." });
});

// 2. Start the Server FIRST
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// 3. Attempt Database Sync in the background (Non-blocking)
const startDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        console.log("✅ Database connected and synced.");
    } catch (error) {
        console.error("❌ Database connection failed, but server is still running.");
        console.error("Reason:", (error as Error).message);
    }
};

startDB();