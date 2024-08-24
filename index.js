import express from "express";
import dotenv from "dotenv";
import chatOpenAIHandler from "./chat-openai.js";
import feedbackRouter from "./feedback.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.post("/api/chat", chatOpenAIHandler);

// Use the feedback router
app.use("/api/feedback", feedbackRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});