import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface GlobalMongo {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const LEGACY_R2_PREFIX = "${R2_STORAGE_BASE}";
const DIRECT_R2_BASE = "https://pub-744e3954979f4d3a86f110dff22f7d4e.r2.dev/iceberg";

async function repairLegacyR2Urls(conn: typeof mongoose) {
  const db = conn.connection.db;
  if (!db) return;

  const collections = [
    { name: "products", fields: ["image"], arrayFields: ["gallery"] },
    { name: "categories", fields: ["image"], arrayFields: [] },
    { name: "blogs", fields: ["coverImage"], arrayFields: [] },
    { name: "reviews", fields: ["authorImage"], arrayFields: [] },
    { name: "sitesettings", fields: ["aboutImage"], arrayFields: [] },
  ];

  const fixUrl = (val: unknown) =>
    typeof val === "string" && val.includes(LEGACY_R2_PREFIX)
      ? val.replaceAll(LEGACY_R2_PREFIX, DIRECT_R2_BASE)
      : val;

  for (const col of collections) {
    const orClauses = [...col.fields, ...col.arrayFields].map((f) => ({
      [f]: { $regex: "^\\$\\{R2_STORAGE_BASE\\}" },
    }));
    const docs = await db
      .collection(col.name)
      .find({ $or: orClauses })
      .toArray();

    for (const doc of docs) {
      const updates: Record<string, unknown> = {};
      for (const f of col.fields) {
        if (typeof doc[f] === "string" && doc[f].includes(LEGACY_R2_PREFIX)) {
          updates[f] = fixUrl(doc[f]);
        }
      }
      for (const af of col.arrayFields) {
        if (Array.isArray(doc[af])) {
          updates[af] = doc[af].map(fixUrl);
        }
      }
      if (Object.keys(updates).length > 0) {
        await db.collection(col.name).updateOne({ _id: doc._id }, { $set: updates });
      }
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal: GlobalMongo | undefined;
  // eslint-disable-next-line no-var
  var r2UrlsRepaired: boolean | undefined;
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
    if (!global.r2UrlsRepaired && cached!.conn) {
      global.r2UrlsRepaired = true;
      await repairLegacyR2Urls(cached!.conn).catch((e) => {
        global.r2UrlsRepaired = false;
        console.error("R2 URL repair skipped:", e);
      });
    }
  } catch (err: any) {
    cached!.promise = null;
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }

  return cached!.conn;
}
