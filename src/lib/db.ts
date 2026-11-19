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
    cached!.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (err: any) {
    cached!.promise = null;
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }

  return cached!.conn;
}
