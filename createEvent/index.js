if (process.env.NODE_ENV !== "production") {
  console.log("Loading env from .env");
  await import("dotenv").then((dotenv) => dotenv.config());
} else {
  console.log("Using lambda set env");
}

import { sqsClient } from "./sqsClient.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import getUniqueIMEIs from "./uniqueIMEI.js";

const QueueUrl = process.env.QUEUE_URL;

export const handler = async (event, context) => {
  const eventDate = event.time.split("T")[0];
  const startTime = new Date(eventDate);
  startTime.setHours(startTime.getHours() - 48);
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 48);
  endTime.setMilliseconds(endTime.getMilliseconds() - 1000);

  console.log({ startTime, endTime });

  const uniqueIMEIs = await getUniqueIMEIs();

  console.log({ uniqueIMEIs });

  for (const IMEI of uniqueIMEIs) {
    console.log(`Running for ${IMEI}`);
    const params = {
      MessageBody: JSON.stringify({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        IMEI,
      }),
      QueueUrl,
    };

    try {
      const result = await sqsClient.send(new SendMessageCommand(params));
      console.log(
        `Message sent for IMEI ${IMEI}. MessageId: ${result.MessageId}`
      );
    } catch (error) {
      console.error(`Error sending message for IMEI ${IMEI}:`, error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // sleep for 5 second before sending the next message. This is to avoid throttling.
  }
};

// handler({ time: "2023-12-24" });

// const { startDate, days = 30 } = { startDate: "2023-11-28" };

// for (let i = 0; i < days; i++) {
//   const date = new Date(startDate);
//   date.setDate(date.getDate() + i);
//   const startDateTime = new Date(date).toISOString().split("T")[0];
//   await callHandler(startDateTime);
// }

// async function callHandler(startDateTime) {
//   handler({ time: startDateTime });
//   console.log("Waiting for 60 sec");
//   await new Promise((resolve) => setTimeout(resolve, 60000));
// }
