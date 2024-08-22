import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || "");
const dbName = "cuny_guide";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { school, question } = req.body;
    
    try {
      // Connect to MongoDB
      await client.connect();
      // Use the school-specific collection
      const collectionName = `${school}_embeddings`;
      const collection = client.db(dbName).collection(collectionName);

      // Create a vector store using the school-specific collection
      const vectorStore = new MongoDBAtlasVectorSearch(
        new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY }),
        {
          collection,
          indexName: "default",
          textKey: "text", 
          embeddingKey: "embedding",
        }
      );

      // Set up the retriever with MMR search
      const retriever = vectorStore.asRetriever({
        searchType: "mmr",
        searchKwargs: {
          fetchK: 20,
          lambda: 0.1,
        },
      });

      // Perform the vector search
      const retrieverOutput = await retriever.getRelevantDocuments(question);
      
      res.status(200).json(retrieverOutput);
    } catch (error) {
      console.error('Error in vector search:', error);
      res.status(500).json({ error: 'An error occurred during vector search' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}