import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function generateData() {
  await client.connect();
  const db = client.db("studyflow");

  const topics = [
    "MongoDB",
    "React Hooks",
    "Express",
    "Node.js",
    "JavaScript ES6",
    "CSS Grid",
    "REST APIs",
    "Authentication",
  ];
  const users = [
    "Alice",
    "Bob",
    "Carol",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
  ];

  const plans = [];
  for (let i = 0; i < 1000; i++) {
    plans.push({
      topic: topics[Math.floor(Math.random() * topics.length)],
      course_url: `https://example.com/course${i}`,
      deadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      hours_per_day: Math.floor(Math.random() * 4) + 1,
      user_name: users[Math.floor(Math.random() * users.length)],
      created_at: new Date(),
      status: Math.random() > 0.3 ? "active" : "completed",
    });
  }

  await db.collection("plans").insertMany(plans);
  console.log("✅ Inserted 1000 plans");

  await client.close();
}

generateData().catch(console.error);
