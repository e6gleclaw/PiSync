# PiSync Backend

A lightweight backend service for syncing offline learning data from PiBook and PiBox devices to the cloud.

## Features
- **POST /sync-event**: Receive and store sync events from devices.
- **GET /device/:id/sync-history**: Fetch sync logs of a device.
- **GET /devices/repeated-failures**: List devices with more than 3 failed syncs.
- **Bonus**: Console notification if a device fails to sync 3 times in a row.

## Tech Stack
- Node.js, Express.js
- MongoDB (via Mongoose)
- Joi (validation)
- Swagger (API docs)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up MongoDB and update `.env` if needed:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pisync
   PORT=3000
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. API docs available at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## API Endpoints
### POST /sync-event
- Receives: `{ device_id, timestamp, total_files_synced, total_errors, internet_speed }`
- Stores sync event in DB.

### GET /device/:id/sync-history
- Returns sync logs for the device.

### GET /devices/repeated-failures
- Lists devices with >3 failed syncs (total_errors > 0).

## Scaling for 100k Devices
- Use a managed MongoDB cluster (e.g., Atlas) with sharding.
- Index on `device_id` and `timestamp`.
- Use connection pooling.
- Deploy Express.js behind a load balancer.
- Archive or aggregate old sync events.
- Consider message queues for heavy writes.

## Error Handling
- All endpoints validate input and return proper error messages.

---
