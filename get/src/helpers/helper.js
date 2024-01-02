import { HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./s3Client.js";

export const presignedGetSignedUrl = async ({
  Bucket = "projecty-test-data",
  Key,
}) => {
  const presignParams = {
    Bucket,
    Key,
  };
  const expiresIn = 3600; // 1 hour
  const command = new GetObjectCommand(presignParams);
  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return url;
};
// presignedGetSignedUrl({});

// Use HeadObjectCommand to check if the key exists

export const keyExists = async ({ Bucket = "projecty-test-data", Key }) => {
  const presignParams = {
    Bucket,
    Key,
  };
  try {
    await s3Client.send(new HeadObjectCommand(presignParams));
    return true;
  } catch (err) {
    if (err.name === "NotFound") {
      console.log(`Key '${presignParams.Key}' does not exist in the bucket.`);
    } else {
      console.error(`Error: ${err}`);
    }
    return false;
  }
};
// keyExists({});
