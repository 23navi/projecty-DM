# Get Data for IMEI from S3 - REST API Endpoint

## Overview

This REST API endpoint, built using AWS API Gateway and AWS Lambda with CORS enabled, facilitates the retrieval of pre-signed S3 URLs for a specified IMEI and date range. The application is deployed using the Serverless Framework (v3).

## Endpoint Structure

- **Endpoint URL:** `https://o10kcrtatf.execute-api.ap-south-1.amazonaws.com/dev/getUrls/{IMEI}?startDate=YYYY-MM-DD&days=X`

## Endpoint Example

- **Endpoint URL:** `https://o10kcrtatf.execute-api.ap-south-1.amazonaws.com/dev/getUrls/357073294020116?startDate=2023-12-01&days=15`

## Endpoint Parameters

- `{IMEI}`: The International Mobile Equipment Identity for which data is requested.
- `startDate`: The starting date for the data retrieval in the format `YYYY-MM-DD`.
- `days`: The number of days for which data is requested.

## Execution Constraints

- **Lambda Configuration:**
  - Maximum Execution Time: 15 minutes.
  - Memory: 512 MB.

## Additional Notes

- **S3 Object Lifecycle:**
  - Objects in S3 are subject to a lifecycle policy.
  - Data older than 30 days may be transitioned from standard storage to S3 Glacier Instant Retrieval.
  - Retrieving data older than 30 days may require additional time, and requests for a high number of days may result in timeouts.

## To-Do

- **Authentication:**
  - Implement authentication for this route to ensure secure access.

## Recommendations

- **Request Considerations:**
  - Be mindful of the retrieval time for data older than 30 days.
  - Requests for a large number of days may lead to timeouts.

## Conclusion

This REST API endpoint provides a convenient way to obtain pre-signed S3 URLs for data retrieval based on IMEI and date range. The application is built with efficiency in mind, adhering to the specified execution constraints. The addition of authentication will further enhance the security of the route. Regular monitoring and optimizations are recommended for ongoing improvements.
