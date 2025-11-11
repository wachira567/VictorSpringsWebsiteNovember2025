import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please add MONGODB_URI to .env.local or Netlify environment variables"
  );
}

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 30000, // Increased from 5s to 30s
  socketTimeoutMS: 60000, // Increased from 45s to 60s
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Development: use global variable to preserve connection
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production: create new client for each function invocation
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Singleton pattern for serverless environments
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  console.log("Attempting to connect to MongoDB...");
  if (cachedClient && cachedDb) {
    console.log("Using cached MongoDB connection");
    return { client: cachedClient, db: cachedDb };
  }

  if (!clientPromise) {
    console.log("Creating new MongoDB client...");
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  try {
    console.log("Waiting for MongoDB connection...");
    cachedClient = await clientPromise;
    cachedDb = cachedClient.db();
    console.log(
      "Successfully connected to MongoDB database:",
      cachedDb.databaseName
    );
    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export default clientPromise;
