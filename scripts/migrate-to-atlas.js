const mongoose = require("mongoose");

const LOCAL_URI = "mongodb://localhost:27017/iceberg_print_studio";
const ATLAS_URI = "mongodb+srv://olunowotiwalade_db_user:GJYXVarxL5BY9j0d@digitalmedia.mejuycb.mongodb.net/iceberg_print_studio?retryWrites=true&w=majority";

async function migrate() {
  console.log("=== STARTING MONGODB MIGRATION TO ATLAS ===");
  console.log("Source (Local):", LOCAL_URI);
  console.log("Target (Atlas):", ATLAS_URI);

  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const atlasConn = await mongoose.createConnection(ATLAS_URI, { serverSelectionTimeoutMS: 15000 }).asPromise();

  console.log(" Connected to both local and Atlas databases!\n");

  const collections = await localConn.db.listCollections().toArray();
  const summary = [];

  for (const collInfo of collections) {
    const collName = collInfo.name;
    if (collName.startsWith("system.")) continue;

    const localColl = localConn.db.collection(collName);
    const atlasColl = atlasConn.db.collection(collName);

    const docs = await localColl.find({}).toArray();
    console.log(`Processing collection: "${collName}" (${docs.length} documents)...`);

    if (docs.length > 0) {
      // Clear existing in target to ensure clean mirror
      await atlasColl.deleteMany({});
      
      // Insert all documents preserving exact _id and BSON types
      await atlasColl.insertMany(docs);
      console.log(` ✓ Successfully copied ${docs.length} documents to Atlas.`);
    } else {
      console.log(` - Collection "${collName}" is empty, skipping insert.`);
    }

    // Copy indexes (except _id_ which is automatic)
    try {
      const indexes = await localColl.indexes();
      for (const idx of indexes) {
        if (idx.name === "_id_") continue;
        const keys = idx.key;
        const options = { name: idx.name };
        if (idx.unique) options.unique = true;
        if (idx.sparse) options.sparse = true;
        await atlasColl.createIndex(keys, options);
        console.log(`   + Recreated index: ${idx.name}`);
      }
    } catch (idxErr) {
      console.warn(`   ! Warning copying indexes for ${collName}:`, idxErr.message);
    }

    const atlasCount = await atlasColl.countDocuments();
    summary.push({ collection: collName, localCount: docs.length, atlasCount });
  }

  console.log("\n=== MIGRATION VERIFICATION SUMMARY ===");
  console.table(summary);

  await localConn.close();
  await atlasConn.close();
  console.log("\n Migration completed successfully!");
}

migrate().catch((err) => {
  console.error("Migration failed with error:", err);
  process.exit(1);
});
