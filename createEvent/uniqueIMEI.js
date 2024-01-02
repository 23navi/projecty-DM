if (process.env.NODE_ENV !== "production") {
  await import("dotenv").then((dotenv) => dotenv.config());
}
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI;

const collectionName = process.env.COLLECTION_NAME;

console.log({ mongoUri });

async function getUniqueIMEIs() {
  try {
    const client = await MongoClient.connect(mongoUri);
    const db = client.db();
    const collection = db.collection(collectionName);

    // Use aggregation to get unique IMEI numbers
    const result = await collection
      .aggregate([
        { $group: { _id: "$IMEI", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    // Extract unique IMEI numbers from the result
    const uniqueIMEINumbers = result.map((item) => item._id);

    client.close();
    return uniqueIMEINumbers;
  } catch (error) {
    console.error("Error exporting data from MongoDB:", error);
  }
}

export default getUniqueIMEIs;
