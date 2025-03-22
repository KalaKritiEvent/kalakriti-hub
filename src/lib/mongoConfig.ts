
// This is a configuration file for MongoDB connection
// Replace placeholder values with your actual MongoDB Atlas credentials

// For security, these values should be stored in environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "kalakriti_hub";

// MongoDB Collections
const COLLECTIONS = {
  USERS: "users",
  SUBMISSIONS: "submissions",
  PAYMENTS: "payments",
  EVENTS: "events",
  RESULTS: "results"
};

/*
 * Steps to set up MongoDB Atlas:
 * 
 * 1. Create a MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
 * 2. Create a new cluster (free tier is available)
 * 3. Set up a database user with password authentication
 * 4. Whitelist your IP address (or use 0.0.0.0/0 for development)
 * 5. Get your connection string from Atlas dashboard
 * 6. Replace the MONGODB_URI placeholder with your actual connection string
 * 7. Install the MongoDB driver: npm install mongodb
 * 8. Use the MongoDB client to connect to your database
 *
 * Example connection code:
 * 
 * import { MongoClient } from 'mongodb';
 * 
 * let cachedClient = null;
 * let cachedDb = null;
 * 
 * export async function connectToDatabase() {
 *   if (cachedClient && cachedDb) {
 *     return { client: cachedClient, db: cachedDb };
 *   }
 * 
 *   const client = await MongoClient.connect(MONGODB_URI, {
 *     useNewUrlParser: true,
 *     useUnifiedTopology: true,
 *   });
 * 
 *   const db = client.db(MONGODB_DB_NAME);
 * 
 *   cachedClient = client;
 *   cachedDb = db;
 * 
 *   return { client, db };
 * }
 */

// Sample User Schema
/*
 * {
 *   _id: ObjectId,
 *   firstName: String,
 *   lastName: String,
 *   email: String,
 *   phoneNumber: String,
 *   password: String (hashed),
 *   contestantId: String,
 *   createdAt: Date,
 *   updatedAt: Date,
 *   submissions: [
 *     {
 *       eventType: String,
 *       submissionId: String,
 *       submissionDate: Date,
 *       paymentId: String,
 *       status: String
 *     }
 *   ]
 * }
 */

// Sample Submission Schema
/*
 * {
 *   _id: ObjectId,
 *   userId: ObjectId,
 *   contestantId: String,
 *   eventType: String,
 *   title: String,
 *   description: String,
 *   fileUrls: [String], // S3 URLs
 *   paymentId: String,
 *   createdAt: Date,
 *   status: String
 * }
 */

export { MONGODB_URI, MONGODB_DB_NAME, COLLECTIONS };
