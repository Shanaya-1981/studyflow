import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// MongoDB connection
let db;
const client = new MongoClient(process.env.MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db("studyflow");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }
}

connectDB();

export { db };

// Import routes
import planRoutes from "./routes/plans.js";
import dailyPlanRoutes from "./routes/dailyPlans.js";
import progressRoutes from "./routes/progress.js";

// API routes (these come FIRST)
app.use("/api/plans", planRoutes);
app.use("/api/daily-plans", dailyPlanRoutes);
app.use("/api/progress", progressRoutes);

// Health check route (optional, for testing)
app.get("/api/health", (req, res) => {
  res.json({ message: "API running!" });
});

// Serve React static files (AFTER API routes)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all: Send index.html for any route not matched above
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});
