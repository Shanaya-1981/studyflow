import express from "express";
import { db } from "../server.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Pre-written study plans
const studyTemplates = {
  MongoDB: [
    {
      day: 1,
      time_slot: "Hour 1",
      title: "Setup MongoDB",
      instructions:
        "1. Download from mongodb.com\n2. Install Community Edition\n3. Run 'mongod' in terminal\n4. Verify installation",
      resources: [
        {
          title: "MongoDB Install Guide",
          url: "https://docs.mongodb.com/manual/installation/",
        },
      ],
    },
    {
      day: 1,
      time_slot: "Hour 2",
      title: "Create First Database",
      instructions:
        "1. Open terminal, type 'mongosh'\n2. Type: use myFirstDB\n3. Insert document: db.users.insertOne({name: 'Test'})\n4. Query: db.users.find()",
      resources: [
        {
          title: "MongoDB CRUD Tutorial",
          url: "https://docs.mongodb.com/manual/crud/",
        },
      ],
    },
    {
      day: 1,
      time_slot: "Hour 3",
      title: "Practice CRUD Operations",
      instructions:
        "1. Create 5 sample documents\n2. Read all documents\n3. Update one document\n4. Delete one document",
      resources: [
        { title: "CRUD Exercises", url: "https://learn.mongodb.com/" },
      ],
    },
  ],
  React: [
    {
      day: 1,
      time_slot: "Hour 1",
      title: "React Basics",
      instructions:
        "1. Create React app\n2. Study components\n3. Build counter app",
      resources: [{ title: "React Docs", url: "https://react.dev" }],
    },
    {
      day: 1,
      time_slot: "Hour 2",
      title: "useState Hook",
      instructions:
        "1. Learn state concept\n2. Practice with examples\n3. Build todo app",
      resources: [
        {
          title: "useState Guide",
          url: "https://react.dev/reference/react/useState",
        },
      ],
    },
    {
      day: 1,
      time_slot: "Hour 3",
      title: "useEffect Hook",
      instructions:
        "1. Understand side effects\n2. Fetch data example\n3. Cleanup functions",
      resources: [
        {
          title: "useEffect Guide",
          url: "https://react.dev/reference/react/useEffect",
        },
      ],
    },
  ],
  Express: [
    {
      day: 1,
      time_slot: "Hour 1",
      title: "Express Setup",
      instructions: "1. npm init\n2. Install express\n3. Create basic server",
      resources: [
        {
          title: "Express Guide",
          url: "https://expressjs.com/en/starter/installing.html",
        },
      ],
    },
    {
      day: 1,
      time_slot: "Hour 2",
      title: "Routes & Middleware",
      instructions:
        "1. Create GET route\n2. Create POST route\n3. Add middleware",
      resources: [
        {
          title: "Routing Guide",
          url: "https://expressjs.com/en/guide/routing.html",
        },
      ],
    },
    {
      day: 1,
      time_slot: "Hour 3",
      title: "Connect to MongoDB",
      instructions:
        "1. Install mongodb package\n2. Create connection\n3. Test with simple query",
      resources: [
        {
          title: "MongoDB Integration",
          url: "https://expressjs.com/en/guide/database-integration.html",
        },
      ],
    },
  ],
};

router.post("/", async (req, res) => {
  try {
    const {
      topic,
      course_url,
      deadline,
      hours_per_day,
      user_name,
      start_time,
    } = req.body;

    let tasks = studyTemplates[topic] || studyTemplates["MongoDB"];

    // If custom time provided, update time slots
    if (start_time) {
      const [hour, minute] = start_time.split(":");
      tasks = tasks.map((task, index) => ({
        ...task,
        time_slot: `${parseInt(hour) + index}:${minute}-${parseInt(hour) + index + 1}:${minute}`,
      }));
    }

    const plan = {
      topic,
      course_url: course_url || null,
      deadline,
      hours_per_day,
      user_name,
      hourly_tasks: tasks,
      created_at: new Date(),
      status: "active",
    };

    const result = await db.collection("plans").insertOne(plan);
    res.json({ plan_id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all plans for user
router.get("/user/:name", async (req, res) => {
  try {
    const plans = await db
      .collection("plans")
      .find({ user_name: req.params.name })
      .toArray();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single plan
router.get("/:id", async (req, res) => {
  try {
    const plan = await db
      .collection("plans")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE plan
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;

    const result = await db
      .collection("plans")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json({ message: "Plan updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE plan
router.delete("/:id", async (req, res) => {
  try {
    const result = await db
      .collection("plans")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
