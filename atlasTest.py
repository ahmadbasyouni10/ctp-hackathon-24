import pymongo
from openai import OpenAI
import dotenv
import os

dotenv.load_dotenv()



mongo_client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = mongo_client.sample_mflix
collection = db.embedded_movies

openai_client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

def generate_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        input = text,
        model = "text-embedding-3-small",
    )
    return response.data[0].embedding


results = collection.aggregate([
     {"$vectorSearch": {
        "queryVector": generate_embedding("Science fiction film with aliens and spaceships"),
        "path": "plot_embedding",
        "numCandidates": 100,
        "limit": 5,
        "index": "vector_index",
     }}
 ])

for item in results:
    print(f'Title: {item["title"]}, Movie Plot: {item["plot"]}')
    


