import express from "express";
import { db } from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// CREATE daily plan (we'll add AI later)
router.post("/", async (req, res) => {
  try {
    const { plan_id, date, hourly_tasks } = req.body;

    const dailyPlan = {
      plan_id: new ObjectId(plan_id),
      date: new Date(date),
      hourly_tasks,
      created_at: new Date(),
    };

    const result = await db.collection("daily_plans").insertOne(dailyPlan);
    res.json({ daily_plan_id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET today's plan for a specific plan
router.get("/plan/:plan_id/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyPlan = await db.collection("daily_plans").findOne({
      plan_id: new ObjectId(req.params.plan_id),
      date: { $gte: today },
    });

    res.json(dailyPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task completion
router.put("/:id/task/:taskIndex", async (req, res) => {
  try {
    const { completed } = req.body;
    const taskIndex = parseInt(req.params.taskIndex);

    const result = await db
      .collection("daily_plans")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { [`hourly_tasks.${taskIndex}.completed`]: completed } },
      );

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
