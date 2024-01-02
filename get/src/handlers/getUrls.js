import { presignedGetSignedUrl, keyExists } from "../helpers/helper.js";
async function getUrls(event, context) {
  const { days = 1, startDate } = event.queryStringParameters ?? {};
  const { IMEI } = event.pathParameters ?? {};

  if (!IMEI) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Provide IMEI" }),
    };
  }

  if (!startDate) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Provide startDate" }),
    };
  }

  const urlArr = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const startDateTime = new Date(date).toISOString();
    const Key = `IMEI-${IMEI}/${startDateTime}-${IMEI}.xlsx`;
    const exists = await keyExists({ Key });
    if (exists) {
      const url = await presignedGetSignedUrl({ Key });
      urlArr.push({ date, url });
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(urlArr),
  };
}

export { getUrls as handler };
