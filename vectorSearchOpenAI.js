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
          path: "embeddings",
          queryVector: embedding, // change this to vectorized question
          numCandidates: 50,
          limit: 1, // return top k results
        },
      },
      {
        $project: {
          // change this to project the fields you want to return
          _id: 1,
          question: 1,
          answer: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];

    // run pipeline
    const result = col.aggregate(pipeline);

    console.log(question);

    await result.forEach((doc) => console.dir(JSON.stringify(doc)));
  } finally {
    await client.close();
  }
}

vectorSearchOpenAI("Who is the President of CCNY?").catch(console.dir);
