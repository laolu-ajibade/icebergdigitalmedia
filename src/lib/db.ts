import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface GlobalMongo {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal: GlobalMongo | undefined;
}

let cached = global.mongooseGlobal;

if (!cached) {
  cached = global.mongooseGlobal = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Missing compulsory environment variable: MONGODB_URI is required. Please set MONGODB_URI in .env.local"
    );
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (err: any) {
    cached!.promise = null;
    throw new Error(`Failed to connect to MongoDB with compulsory MONGODB_URI: ${err.message}`);
  }

  return cached!.conn;
}

// In-Memory Hybrid Fallback Store
export interface MemoryStore {
  products: any[];
  categories: any[];
  blogs: any[];
  orders: any[];
  settings: any;
  monthlyVisits: Record<string, number>;
  adminUser: any;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStoreGlobal: MemoryStore | undefined;
}

export const memoryStore: MemoryStore =
  global.memoryStoreGlobal ||
  (global.memoryStoreGlobal = {
    products: [],
    categories: [],
    blogs: [],
    orders: [],
    settings: null,
    monthlyVisits: {},
    adminUser: null,
  });
