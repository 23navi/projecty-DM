if (process.env.NODE_ENV !== "production") {
  await import("dotenv").then((dotenv) => dotenv.config());
}
import { SQSClient } from "@aws-sdk/client-sqs";
const REGION = "ap-south-1";
const sqsClient = new SQSClient({ region: REGION });
export { sqsClient };
