if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}
import { MongoClient } from "mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import XLSX from "xlsx";

const mongoUri = process.env.MONGO_URI;
const collectionName = process.env.COLLECTION_NAME;

// Initialize MongoDB client outsite the handler function
//  will be shared among all the lambda functions created within 15 min of the first function
//  (Lambda executation context)
const client = await MongoClient.connect(mongoUri);
const db = client.db();
const collection = db.collection(collectionName);

async function exportFromMongoDB({ query }) {
  try {
    const cursor = collection.find(query);
    const data = await cursor.toArray();

    if (data.length === 0) {
      console.log("No data found for the given query.");
      client.close();
      return null;
    }

    // Write to XLSX
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // If we close the client connection ? How will other lambda function in the context will connect?
    // client.close();

    // console.log("Data exported from MongoDB.");

    return xlsxBuffer;
  } catch (error) {
    console.error("Error exporting data from MongoDB:", error);
  }
}

// Upload xlsx
async function uploadToS3({ s3Key, xlsxBuffer }) {
  const s3Bucket = "projecty-test-data";
  try {
    const s3 = new S3Client();

    const params = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: xlsxBuffer,
    };

    await s3.send(new PutObjectCommand(params));

    console.log("Data uploaded successfully to S3.");
  } catch (error) {
    console.error("Error uploading data to S3:", error);
  }
}

// XLSX
const entryPoint = async ({ IMEI, startTime, endTime }) => {
  const outputFile = `${startTime.toISOString()}-${IMEI}.xlsx`;
  const s3Key = `IMEI-${IMEI}/${outputFile}`;

  const query = {
    Timestamp: {
      $gte: startTime,
      $lte: endTime,
    },
    IMEI: {
      $eq: IMEI,
    },
  };
  const xlsxBuffer = await exportFromMongoDB({ query });
  if (!xlsxBuffer) {
    return; // Exit the function if no data is found.
  }
  await uploadToS3({ s3Key, xlsxBuffer });
};

export default entryPoint;

// entryPoint({
//   IMEI: 357073294010562,
//   startTime: new Date("2023-12-21T00:00:00Z"),
//   endTime: new Date("2023-12-21T23:59:59Z"),
// });
