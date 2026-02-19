import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

// Standard Industry Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Pointing to your friend's Vite frontend
    credentials: true
}));

// Basic GET Route for verification
app.get("/", (req, res) => {
    res.json({
        message: "Kanban API is live!",
        status: "Running",
        port: PORT 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});