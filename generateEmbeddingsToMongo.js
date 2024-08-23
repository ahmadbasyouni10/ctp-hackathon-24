import createEmbeddings from "./EmbeddingsOpenAI.js";
import { connectToMongoDB } from "./mongodb_setup.js";
import fs from "fs";
import path from "path";

/**
 * @typedef {Object} Data
 * @property {string} question - The question being asked.
 * @property {string} answer - The answer to the question.
 * @property {string[]} tags - Tags related to the question and answer.
 * @property {string} context - Additional context for the question and answer.
 * @property {string} school - The school associated with the question and answer.
 */

/** @type {Data[]} */

/**
 * @typedef {Object} EmbeddingObject
 * @property {string} object - The type of the object, which is 'embedding'.
 * @property {number} index - The index of the embedding in the list.
 * @property {Array.<number>} embedding - An array representing the embedding vector.
 * @typedef {Object} Usage
 * @property {number} prompt_tokens - The number of tokens in the input prompt.
 * @property {number} total_tokens - The total number of tokens processed, including prompt tokens.
 */

// Read the JSON file using Node.js file system module
const filePath = path.resolve("./_assets/cuny_docs/ccny.json");
const dataArray = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function generateEmbeddingsToMongo() {
  const client = await connectToMongoDB();
  try {
    const documentsToInsert = [];

    // loop through the data array
    for (const item of dataArray) {
      // Create a string by combining the property names and their values
      const inputString = `question: ${item.question}\n answer: ${
        item.answer
      }\n tags: ${item.tags.join(", ")}`;

      // Generate the embedding for the input string
      const data = await createEmbeddings(inputString);

      const embedding = data.data[0].embedding;

      // Add the embedding to the original object
      const documentWithEmbedding = {
        ...item,
        plot_embedding: embedding,
      };

      documentsToInsert.push(documentWithEmbedding);
    }

    const database = client.db("cuny_guide");
    const collection = database.collection("ccny_embeddings");

    // Insert the combined documents into the collection
    const result = await collection.insertMany(documentsToInsert);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (error) {
    console.error("Error inserting documents:", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB closed");
  }
}

generateEmbeddingsToMongo().catch(console.error);
