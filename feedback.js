const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

router.post('/submit-feedback', async (req, res) => {
  const { question, details, school } = req.body;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    const database = client.db("cuny_guide");
    const collection = database.collection("feedback");

    const result = await collection.insertOne({
      question,
      details,
      school,
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "An error occurred while submitting feedback" });
  } finally {
    await client.close();
  }
});

module.exports = router;