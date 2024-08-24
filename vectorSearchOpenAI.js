import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import createEmbeddings from "./EmbeddingsOpenAI.js";

dotenv.config();

// connect to your Atlas cluster
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function vectorSearchOpenAI(question) {
  try {
    await client.connect();

    const database = client.db("cuny_guide");
    const col = database.collection("ccny_embeddings");

    // embed the question
    const data = await createEmbeddings(question);
    const embedding = data.data[0].embedding;

    // console.log(embedding);

    // define pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: "ccny_vector_index",
          filter: {
            school: {
              $eq: "CCNY",
            },
          },
          path: "plot_embedding",
          queryVector: embedding,
          limit: 3, // return top k results
          // increase if we have more than 100 docs
          numCandidates: 100,
        },
      },
      {
        $project: {
          // change this to project the fields you want to return
          _id: 1,
          question: 1,
          answer: 1,
          context: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];

    // run pipeline
    const results = await col.aggregate(pipeline).toArray();
    const documents = [];

    // why do we need this step to return the results? When I remove this step, its a bunch of meta data. - Daniel
    await results.forEach((doc) => {
      const docString = JSON.stringify(doc);
      // console.dir(docString);
      documents.push(doc);
    });

    return documents;
  } catch (error) {
    console.error("Error fetching filtered schools:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export default vectorSearchOpenAI;
