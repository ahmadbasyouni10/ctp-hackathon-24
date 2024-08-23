import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // Enable SSL
    tlsAllowInvalidCertificates: true, // Allow invalid certificates (use with caution)
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    console.log(movie);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB closed");
  }
}

connectToMongoDB().catch(console.error);
