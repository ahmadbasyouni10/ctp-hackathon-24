import { promises as fsp } from "fs";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGO_URI || "");
const dbName = "cuny_guide";

const docs_dir = "_assets/cuny_docs";

async function createEmbeddings() {
  const fileNames = await fsp.readdir(docs_dir);
  console.log(fileNames);

  for (const fileName of fileNames) {
    const schoolName = fileName.replace(".md", "");
    const collectionName = `${schoolName}_embeddings`;
    
    const collection = client.db(dbName).collection(collectionName);

    const document = await fsp.readFile(`${docs_dir}/${fileName}`, "utf-8");
    console.log(`Vectorizing ${fileName}...`);

    
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const output = await splitter.createDocuments([document]);
    
    await MongoDBAtlasVectorSearch.fromDocuments(
      output,
      new OpenAIEmbeddings(),
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