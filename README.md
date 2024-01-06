# ProjectY Data Management tool

## Module 1: SQS Message Processor

### Overview

The SQS Message Processor efficiently processes messages from Amazon SQS, where each message represents an IMEI and a date range for data retrieval.

### Execution Flow

1. **Fetch Data from MongoDB:**

   - Retrieve data for the specified IMEI and date range from MongoDB.
   - Maintain a reusable database connection.

2. **Convert Data to XLSX:**

   - Convert fetched data to XLSX format in memory.

3. **Upload XLSX to S3:**
   - Upload XLSX file to S3 with format: `{IMEI}/{YYYY-MM-DDT00:00:00.000Z}-{IMEI}.xlsx`

### Constraints

- **Memory:** 1.5 GB
- **Execution Time:** 60 seconds

## Module 2: Cron Job Event Creator

### Overview

Generates daily backup events for unique IMEIs, pushing them to SQS at 00:00:01 UTC for the previous day.

### Execution Flow

1. **Retrieve Unique IMEIs:**

   - Fetch unique IMEIs from the database.

2. **Create Events in SQS:**
   - For each IMEI, create an event in SQS with a 5-second delay between events.

### Execution Time

- For 100 devices: ~497.5 seconds
- **Lambda Limit:** 900 seconds

## Module 3: Get Data for IMEI from S3 - REST API

### Overview

REST API endpoint for retrieving pre-signed S3 URLs for a specified IMEI and date range.

### Endpoint

- **URL:** [https://o10kcrtatf.execute-api.ap-south-1.amazonaws.com/dev/getUrls/{IMEI}?startDate=YYYY-MM-DD&days=X](https://o10kcrtatf.execute-api.ap-south-1.amazonaws.com/dev/getUrls/{IMEI}?startDate=YYYY-MM-DD&days=X)

### Constraints

- **Lambda Time:** 15 minutes
- **Memory:** 512 MB

### Recommendations

- **S3 Object Lifecycle:**

  - Objects older than 30 days may transition to S3 Glacier.
  - Retrieving older data may take extra time; high day requests may timeout.

- **To-Do:**
  - Implement authentication for secure access.
