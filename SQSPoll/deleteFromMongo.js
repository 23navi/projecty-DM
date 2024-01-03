if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}

import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;
const collectionName = "test"; // change the collection name

const client = await MongoClient.connect(mongoUri);
const db = client.db();
const collection = db.collection(collectionName);

async function deleteFromMongoDB({ query }) {
  try {
    const result = await collection.deleteMany(query);
    console.log({ result });
    console.log(
      `Data deleted for IMEI ${query.IMEI.$eq} of date ${query.Timestamp.$gte}`
    );
    // client.close();
  } catch (error) {
    console.error("Error deleting  data from MongoDB:", error);
  }
}

export default deleteFromMongoDB;
