import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;
let globalEnv = null;

export function setGlobalEnv(env) {
  globalEnv = env;
}

class MongoCollectionDataApi {
  constructor(collectionName, env) {
    this.collectionName = collectionName;
    this.env = env;
    this.url = env.MONGODB_DATA_API_URL;
    this.apiKey = env.MONGODB_API_KEY;
    this.database = env.MONGODB_DATABASE || 'third_ai_commercials';
    this.dataSource = env.MONGODB_DATASOURCE || 'Cluster0';
  }

  async request(action, payload) {
    const res = await fetch(`${this.url}/action/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': this.apiKey
      },
      body: JSON.stringify({
        dataSource: this.dataSource,
        database: this.database,
        collection: this.collectionName,
        ...payload
      })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`MongoDB Data API error (${action}): ${res.status} - ${text}`);
    }
    return await res.json();
  }

  async find(filter = {}) {
    const self = this;
    return {
      query: { filter: formatFilter(filter) },
      sort(sortOptions) {
        this.query.sort = sortOptions;
        return this;
      },
      async toArray() {
        const res = await self.request('find', this.query);
        const docs = res.documents || [];
        return docs.map(formatDocument);
      }
    };
  }

  async findOne(filter = {}) {
    const res = await this.request('findOne', { filter: formatFilter(filter) });
    return formatDocument(res.document);
  }

  async insertOne(document) {
    const res = await this.request('insertOne', { document });
    return { insertedId: res.insertedId };
  }

  async updateOne(filter, update) {
    const res = await this.request('updateOne', { 
      filter: formatFilter(filter), 
      update: formatUpdate(update) 
    });
    return { modifiedCount: res.modifiedCount };
  }

  async deleteOne(filter) {
    const res = await this.request('deleteOne', { filter: formatFilter(filter) });
    return { deletedCount: res.deletedCount };
  }

  async countDocuments(filter = {}) {
    const res = await this.request('find', { filter: formatFilter(filter), projection: { _id: 1 } });
    return (res.documents || []).length;
  }
}

// Utility to convert MongoDB returned { $oid: '...' } objects to string ID for frontend compatibility
function formatDocument(doc) {
  if (!doc) return null;
  const formatted = { ...doc };
  if (formatted._id && typeof formatted._id === 'object' && formatted._id.$oid) {
    formatted._id = formatted._id.$oid;
  }
  return formatted;
}

// Utility to convert ObjectId instances to string-based $oid for Data API payload
function formatFilter(filter) {
  if (!filter) return {};
  const formatted = { ...filter };
  for (const key in formatted) {
    const val = formatted[key];
    if (val && typeof val === 'object') {
      if (val instanceof ObjectId || val._bsontype === 'ObjectID') {
        formatted[key] = { $oid: val.toString() };
      } else if (val._id) {
        formatted[key]._id = { $oid: val._id.toString() };
      } else if (val.$ne && (val.$ne instanceof ObjectId || val.$ne._bsontype === 'ObjectID')) {
        formatted[key].$ne = { $oid: val.$ne.toString() };
      }
    }
  }
  return formatted;
}

function formatUpdate(update) {
  if (!update) return {};
  const formatted = { ...update };
  if (formatted.$set) {
    formatted.$set = formatFilter(formatted.$set);
  }
  return formatted;
}

export async function getCollection(mongoUri, collectionName) {
  // If MongoDB Data API credentials are provided, use it
  if (globalEnv && globalEnv.MONGODB_API_KEY && globalEnv.MONGODB_DATA_API_URL) {
    return new MongoCollectionDataApi(collectionName, globalEnv);
  }

  // Otherwise, use standard MongoDB TCP driver
  if (!cachedClient) {
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing from environment variables');
    }
    const client = new MongoClient(mongoUri);
    await client.connect();
    cachedClient = client;
  }
  return cachedClient.db().collection(collectionName);
}
