if (process.env.NODE_ENV !== "production") {
  console.log("Loading env from .env");
  import("dotenv").then((dotenv) => dotenv.config());
} else {
  console.log("Using lambda set env");
}
import { sqsClient } from "./sqsClient.js";
import mongoToS3 from "./uploadToS3.js";
import { DeleteMessageCommand } from "@aws-sdk/client-sqs";

const QueueUrl = process.env.QUEUE_URL;

export const handler = async (event) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    try {
      await mongoToS3({
        IMEI: body.IMEI,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
      });
    } catch (error) {
      console.log(error.message);
    }
    // Delete the message from the queue (When lambda is used with SQS, we don't need to delete the message, it's handled automatically)
    //https://docs.aws.amazon.com/en_gb/lambda/latest/dg/with-sqs.html
    //https://stackoverflow.com/questions/57460190/sqs-deleting-automatically-messages-after-receiving-them-by-lambda
    await deleteMessage(record.receiptHandle);
  }
};

const deleteMessage = async (receiptHandle) => {
  const deleteParams = {
    QueueUrl,
    ReceiptHandle: receiptHandle,
  };

  try {
    await sqsClient.send(new DeleteMessageCommand(deleteParams));
  } catch (error) {
    console.error("Error deleting message from the queue:", error);
  }
};
