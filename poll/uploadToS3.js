if (process.env.NODE_ENV !== "production") {
  import("dotenv").then((dotenv) => dotenv.config());
}
import { MongoClient } from "mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import XLSX from "xlsx"; // Import XLSX library.

async function exportFromMongoDB({ query }) {
  const mongoUri = process.env.MONGO_URI;
  const collectionName = process.env.COLLECTION_NAME;
  try {
    const client = await MongoClient.connect(mongoUri);
    const db = client.db();
    const collection = db.collection(collectionName);
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

    client.close();

    console.log("Data exported from MongoDB.");
    // return jsonData;
    return xlsxBuffer; // Return the XLSX buffer instead of JSON data.
  } catch (error) {
    console.error("Error exporting data from MongoDB:", error);
  }
}

// async function uploadToS3({ s3Key, jsonBuffer }) {
//   const s3Bucket = "projecty-test-data";
//   try {
//     const s3 = new S3Client();

//     const params = {
//       Bucket: s3Bucket,
//       Key: s3Key,
//       Body: jsonBuffer,
//     };

//     await s3.send(new PutObjectCommand(params));

//     console.log("Data uploaded successfully to S3.");
//   } catch (error) {
//     console.error("Error uploading data to S3:", error);
//   }
// }

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
//JSON
// const entryPoint = async ({ IMEI, startTime, endTime }) => {
//   const outputFile = `${startTime.toISOString()}.json`;
//   const s3Key = `IMEI-${IMEI}/${outputFile}`;

//   const query = {
//     Timestamp: {
//       $gte: startTime,
//       $lte: endTime,
//     },
//     IMEI: {
//       $eq: IMEI,
//     },
//   };
//   const jsonBuffer = await exportFromMongoDB({ query });
//   if (!jsonBuffer) {
//     return; // Exit the function if no data is found.
//   }
//   await uploadToS3({ s3Key, jsonBuffer });
// };

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
