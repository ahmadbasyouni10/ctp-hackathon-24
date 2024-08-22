import { promises as fsp } from "fs";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB using the URI from environment variables
const client = new MongoClient(process.env.MONGO_URI || "");
const dbName = "cuny_guide";

// Directory containing markdown files for each school
const docs_dir = "_assets/cuny_docs";

async function createEmbeddings() {
  // Read all files in the docs directory
  const fileNames = await fsp.readdir(docs_dir);
  console.log(fileNames);

  for (const fileName of fileNames) {
    // Extract school name from file name (remove .md extension)
    const schoolName = fileName.replace(".md", "");
    // Create a unique collection name for each school
    const collectionName = `${schoolName}_embeddings`;
    
    // Get (or create) the collection for this school
    const collection = client.db(dbName).collection(collectionName);

    // Read the content of the markdown file
    const document = await fsp.readFile(`${docs_dir}/${fileName}`, "utf-8");
    console.log(`Vectorizing ${fileName}...`);

    // Split the document into smaller chunks
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const output = await splitter.createDocuments([document]);
    
    // Create embeddings and store them in the school-specific collection
    await MongoDBAtlasVectorSearch.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY }),
      {
        collection,
        indexName: "default",
        textKey: "text",
        embeddingKey: "embedding",
      }
    );
  }

  console.log("Done: Closing Connection");
  await client.close();
}

createEmbeddings().catch(console.error);