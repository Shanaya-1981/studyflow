import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateStudyPlan(topic, hoursPerDay, numDays) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a ${numDays}-day study plan for: "${topic}"
Student has ${hoursPerDay} hours per day.

For EACH day, create ${hoursPerDay} hourly tasks.

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "day": 1,
    "time_slot": "9-10am",
    "title": "Task title",
    "instructions": "Step 1\\nStep 2\\nStep 3",
    "resources": [{"title": "Resource name", "url": "https://example.com"}]
  }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
}
