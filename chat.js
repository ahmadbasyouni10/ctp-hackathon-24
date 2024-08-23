import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { messages, school } = req.body;
    const currentMessageContent = messages[messages.length - 1].content;

    try {
      // Perform vector search to get relevant context
      const vectorSearchResponse = await axios.post(
        `${process.env.API_URL}/api/vectorSearch`,
        {
          school,
          question: currentMessageContent,
        }
      );

      const vectorSearch = vectorSearchResponse.data;

      // Create a prompt template with the retrieved context
      const TEMPLATE = `You are a helpful ${school} guide who loves to assist students! Given the following sections from the ${school} documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "I'm sorry, I don't have that specific information about ${school}."
      
      Context sections:
      ${JSON.stringify(vectorSearch)}
      Question: """
      ${currentMessageContent}
      """
      `;

      // Initialize the OpenAI chat model
      const llm = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_KEY,
        modelName: "gpt-4o mini",
        temperature: 0,
      });

      // Generate a response using the chat model
      const response = await llm.call(
        messages.map((m) =>
          m.role === "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        )
      );

      res.status(200).json(response);
    } catch (error) {
      console.error("Error in chat:", error);
      res
        .status(500)
        .json({ error: "An error occurred during chat processing" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
