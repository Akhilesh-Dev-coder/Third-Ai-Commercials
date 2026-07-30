import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function connectToDatabase(mongoUri) {
  if (cachedClient) {
    return cachedClient.db();
  }
  
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from environment variables');
  }

  // Create client and connect
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  
  return client.db();
}

export async function getCollection(mongoUri, collectionName) {
  const db = await connectToDatabase(mongoUri);
  return db.collection(collectionName);
}
