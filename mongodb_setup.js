import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

export async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // Enable SSL
    tlsAllowInvalidCertificates: true, // Allow invalid certificates (use with caution)
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
