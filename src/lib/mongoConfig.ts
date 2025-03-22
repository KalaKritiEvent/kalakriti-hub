
import { MongoClient } from 'mongodb';

// MongoDB connection string and database name
// Using the database name from your MongoDB Atlas dashboard
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kalakritievent64:<db_password>@cluster0.uvvzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "kalakritievent64";

// MongoDB Collections
const COLLECTIONS = {
  USERS: "users",
  SUBMISSIONS: "submissions",
  PAYMENTS: "payments",
  EVENTS: "events",
  RESULTS: "results"
};

// Cached connection
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

/**
 * Connect to MongoDB Atlas
 * Reuses existing connection if available
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!MONGODB_DB_NAME) {
    throw new Error('Please define the MONGODB_DB_NAME environment variable');
  }

  try {
    // Connect to the MongoDB cluster
    const client = await MongoClient.connect(MONGODB_URI);
    
    const db = client.db(MONGODB_DB_NAME);
    
    // Cache the database connection
    cachedClient = client;
    cachedDb = db;
    
    console.log('Connected successfully to MongoDB Atlas');
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

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
