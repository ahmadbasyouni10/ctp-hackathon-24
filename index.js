import express from 'express';
import dotenv from 'dotenv';
import vectorSearchHandler from './vectorSearch.js';
import chatHandler from './chat.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/vectorSearch', vectorSearchHandler);
app.post('/api/chat', chatHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});