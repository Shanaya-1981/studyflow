import express from "express";
import { db } from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// CREATE/UPDATE daily progress
router.post("/", async (req, res) => {
  try {
    const { user_name, plan_id, date, hours_completed, total_hours } = req.body;

    const today = new Date(date);
    today.setHours(0, 0, 0, 0);

    // Check if progress exists for today
    const existing = await db.collection("progress").findOne({
      user_name,
      plan_id: new ObjectId(plan_id),
      date: today,
    });

    if (existing) {
      // Update existing
      await db
        .collection("progress")
        .updateOne(
          { _id: existing._id },
          {
            $set: {
              hours_completed,
              all_tasks_done: hours_completed === total_hours,
            },
          },
        );
      res.json({ message: "Progress updated" });
    } else {
      // Create new
      const progress = {
        user_name,
        plan_id: new ObjectId(plan_id),
        date: today,
        hours_completed,
        total_hours,
        all_tasks_done: hours_completed === total_hours,
        created_at: new Date(),
      };

      await db.collection("progress").insertOne(progress);
      res.json({ message: "Progress created" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET streak for user
router.get("/streak/:user_name", async (req, res) => {
  try {
    const progressList = await db
      .collection("progress")
      .find({
        user_name: req.params.user_name,
        all_tasks_done: true,
      })
      .sort({ date: -1 })
      .toArray();

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let record of progressList) {
      const recordDate = new Date(record.date);
      const daysDiff = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
