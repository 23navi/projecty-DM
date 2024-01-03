# Cron Job Event Creator Module

## Overview

This module is designed to create daily backup events and push them to an Amazon Simple Queue Service (SQS) at 00:00:01 UTC for the previous day. The Lambda function retrieves the list of all unique International Mobile Equipment Identity (IMEI) numbers from the database. For each IMEI, an event is created in SQS with a delay of 5 seconds between each event.

## Details

### Event Creation Logic

1. **Event Trigger Time:** Daily at 00:00:01 UTC.
2. **Backup Period:** The events created correspond to the data backup for the day before the trigger date.
   - Example: If the current date is 24/11/2023, the events will be created for backing up data from 22/11/2023 00:00:00 IST to 23:59:59 IST.

### Lambda Execution Flow

1. **Retrieve Unique IMEI Numbers:**

   - Fetch the list of all unique IMEI numbers from the database.
   - Execution Time: 2-3 seconds (once per invocation).

2. **Create Events in SQS:**
   - For each unique IMEI, create an event in SQS.
   - Event Creation Time: ~20 ms per IMEI.
   - Wait Time Between Events: 5 seconds.

### Execution Time Calculation

- If there are 100 devices:
  - Time to create events: 100 \* ~25 ms = ~2500 ms (2.5 seconds)
  - Time for waiting between events: (100 - 1) \* 5 sec = 495 seconds
  - Total Execution Time: ~2.5 seconds + ~495 seconds = ~497.5 seconds

### Lambda Execution Limit

- The Lambda function's execution limit is set to 900 seconds.

## Conclusion

The module efficiently creates daily backup events for unique IMEI numbers, ensuring data integrity and reliability. With proper consideration of the Lambda execution limit, the system can handle a substantial number of devices within the allotted time frame. Regular monitoring and optimization can further enhance the performance of the system.
