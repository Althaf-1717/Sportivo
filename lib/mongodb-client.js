import { MongoClient } from "mongodb";

let clientPromise;

if (process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    if (!globalThis._mongoClientPromise) {
      const client = new MongoClient(process.env.MONGODB_URI);
      globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
  } else {
    // In production serverless functions, reuse client if present on global
    if (!globalThis._mongoClientPromise) {
      const client = new MongoClient(process.env.MONGODB_URI);
      globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
  }
}

export default clientPromise;
