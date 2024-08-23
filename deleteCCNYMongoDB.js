import { connectToMongoDB } from "./mongodb_setup.js";

async function deleteCCNYMongoDB() {
  const client = await connectToMongoDB();
  try {
    const database = client.db("cuny_guide");
    const collection = database.collection("ccny_embeddings");
    await collection.deleteMany({});
    console.log("Deleted all documents in the collection 'ccny_embeddings'");
  } catch (error) {
    console.error("Error deleting documents:", error);
  } finally {
    await client.close();
    console.log("Connection to MongoDB closed");
  }
}

deleteCCNYMongoDB().catch(console.error);
