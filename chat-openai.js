import dotenv from "dotenv";
import OpenAI from "openai";
import vectorSearchOpenAI from "./vectorSearchOpenAI.js";

dotenv.config();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { messages, school } = req.body;

    const currentMessageContent = messages[messages.length - 1].content;

    try {
      const previousMessages = messages.slice(0, -1);

      // Initialize the OpenAI chat model
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY,
      });

      // Perform the RAG search
      const ragResults = await vectorSearchOpenAI(currentMessageContent);

      // Ensure ragResults is an array of strings
      const ragMessages = Array.isArray(ragResults) ? ragResults : [ragResults];

      const formattedRagMessages = ragMessages.map((result) =>
        typeof result === "string" ? result : JSON.stringify(result)
      );

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful ${school} guide who loves to assist students! If you are unsure say "I'm sorry, I don't have that specific information."`,
          },
          ...previousMessages,
          ...formattedRagMessages.map((result) => ({
            role: "assistant",
            content: result,
          })),
          {
            role: "user",
            content: currentMessageContent,
          },
        ],
      });

      const response = completion.choices[0].message.content;
      // console.log(completion.choices[0].message);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({
        error: "An error occurred during chat processing",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
