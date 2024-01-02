if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

import { MongoClient } from "mongodb";

async function deleteFromMongoDB({ query }) {
  const mongoUri = process.env.MONGO_URI;
  const collectionName = "test";
  try {
    const client = await MongoClient.connect(mongoUri);
    const db = client.db();
    const collection = db.collection(collectionName);
    const result = await collection.deleteMany(query);
    console.log({ result });
    console.log(
      `Data deleted for IMEI ${query.IMEI.$eq} of date ${query.Timestamp.$gte}`
    );
    client.close();
  } catch (error) {
    console.error("Error deleting  data from MongoDB:", error);
  }
}

export default deleteFromMongoDB;
