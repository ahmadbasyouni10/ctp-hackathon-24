import dotenv from 'dotenv';
import { OpenAI } from "@langchain/openai";

dotenv.config();

async function testLangChain() {
  console.log("API Key:", process.env.OPENAI_KEY); // This will log your API key, be careful!
  const model = new OpenAI({ 
    openAIApiKey: process.env.OPENAI_KEY,
    temperature: 0.9 
  });
  console.log("LangChain imports are working!");
}

testLangChain().catch(console.error);