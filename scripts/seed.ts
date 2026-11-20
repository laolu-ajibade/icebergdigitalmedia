import { seedDatabase } from "../src/lib/seed";
import mongoose from "mongoose";

async function main() {
  try {
    console.log("Seeding database...");
    await seedDatabase();
    console.log("Database seed completed.");
  } catch (err) {
    console.error("Database seed failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
