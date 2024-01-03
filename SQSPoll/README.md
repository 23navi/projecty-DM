# SQS Message Processor Module

## Overview

This module is designed to poll incoming messages from an Amazon Simple Queue Service (SQS) and process each message individually. The Lambda function processes a single message, where each message represents a unique International Mobile Equipment Identity (IMEI) and the corresponding date range for data retrieval.

## Message Body Example

```json
{
  "IMEI": 357073294010562,
  "startTime": "2023-12-21T00:00:00Z",
  "endTime": "2023-12-21T23:59:59Z"
}
```

## Execution Flow

1. **Fetch Data from MongoDB:**

   - Retrieve data from MongoDB for the specified IMEI and date range.
   - Database Connection: Maintained within the Lambda context for reuse.
   - Data Size: Each database fetch for one IMEI is approximately 16 MB.

2. **Convert Data to XLSX Format:**

   - Convert the fetched data to XLSX format.
   - Converted file is kept in memory (not as a file).

3. **Upload XLSX File to S3:**
   - Upload the XLSX file to Amazon S3 with the following format:
     - Bucket Path: `{IMEI}/{YYYY-MM-DDT00:00:00.000Z}-{IMEI}.xlsx`

## Execution Constraints

- **Memory:** The Lambda function is configured with a memory limit of 1.5 GB.
- **Execution Time:** The maximum execution time is set to 60 seconds.

## Resource Reuse

- **MongoDB Connection:** Maintained within the Lambda context to avoid creating multiple database connections for each function invocation.
- **SQS Connection:** Utilized within the Lambda context for efficient message retrieval.

## Memory and Execution Time Considerations

- **Data Size:** Each database fetch for one IMEI is around 16 MB.
- **Memory Usage:** Careful consideration of memory usage is essential due to the large size of data and the subsequent conversion to XLSX format.
- **Execution Time:** The function is optimized to complete within the 60-second execution time limit.

## Conclusion

This module ensures efficient processing of individual messages from SQS, including data retrieval from MongoDB, conversion to XLSX format, and uploading to S3. By maintaining connections within the Lambda context and optimizing memory usage, the system is designed to handle large datasets while adhering to the specified execution constraints. Regular monitoring and potential optimizations are recommended for ongoing performance improvements.
