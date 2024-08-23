import createEmbeddings from "./EmbeddingsOpenAI.js";
import { connectToMongoDB } from "./mongodb_setup.js";

async function fetchMovie() {
  const client = await connectToMongoDB();
  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    console.log(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB closed");
  }
}

fetchMovie().catch(console.error);
// async function generateEmbeddingsToMongo() {}
