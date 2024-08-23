import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

async function createEmbeddings(text) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  console.log(embedding.data);
}

createEmbeddings("Your text string goes here");

export default createEmbeddings;
