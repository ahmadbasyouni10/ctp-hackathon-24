import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import chatOpenAIHandler from "./chat-openai.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

app.post("/api/chat", chatOpenAIHandler);

app.post("/api/feedback/submit-feedback", async (req, res) => {
  const { question, details, school } = req.body;

  const client = new MongoClient(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    const database = client.db("cuny_guide");
    const collection = database.collection("feedback");

    const result = await collection.insertOne({
      question,
      details,
      school,
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "An error occurred while submitting feedback" });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});