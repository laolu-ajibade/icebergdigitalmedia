import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "https://pub-91aeee2720ed468690380aee96842095.r2.dev").replace(/\/+$/, "");

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment!");
  process.exit(1);
}

const urlMap = {
  "/images/products/boxes.jpg": `${R2_PUBLIC_URL}/iceberg/images/products/boxes.jpg`,
  "/images/products/clothes.jpg": `${R2_PUBLIC_URL}/iceberg/images/products/clothes.jpg`,
  "/images/products/cups.jpg": `${R2_PUBLIC_URL}/iceberg/images/products/cups.jpg`,
  "/images/products/bags.jpg": `${R2_PUBLIC_URL}/iceberg/images/products/bags.jpg`,
  "/images/products/banner.jpg": `${R2_PUBLIC_URL}/iceberg/images/products/banner.jpg`,
  "/images/products/business-cards.jpg": `${R2_PUBLIC_URL}/iceberg/images/products/business-cards.jpg`,
  "/logo.png": `${R2_PUBLIC_URL}/iceberg/logo.png`,
  "/logo-icon.jpg": `${R2_PUBLIC_URL}/iceberg/logo-icon.jpg`,
  "/favicon.ico": `${R2_PUBLIC_URL}/iceberg/favicon.ico`,
};

function replaceUrl(str) {
  if (!str) return str;
  if (urlMap[str]) return urlMap[str];
  if (str.includes("pub-91aeee2720ed468690380aee96842095.r2.dev")) {
    return str.replace("https://pub-91aeee2720ed468690380aee96842095.r2.dev", R2_PUBLIC_URL);
  }
  return str;
}

async function migrate() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;

  // 1. Update Categories
  const categoriesCol = db.collection("categories");
  const categories = await categoriesCol.find({}).toArray();
  for (const cat of categories) {
    const updatedImage = replaceUrl(cat.image);
    if (updatedImage !== cat.image) {
      await categoriesCol.updateOne({ _id: cat._id }, { $set: { image: updatedImage } });
      console.log(`Updated Category "${cat.name}" image -> ${updatedImage}`);
    }
  }

  // 2. Update Products
  const productsCol = db.collection("products");
  const products = await productsCol.find({}).toArray();
  for (const prod of products) {
    const updatedImage = replaceUrl(prod.image);
    const updatedGallery = Array.isArray(prod.gallery) ? prod.gallery.map(replaceUrl) : [];
    await productsCol.updateOne(
      { _id: prod._id },
      { $set: { image: updatedImage, gallery: updatedGallery } }
    );
    console.log(`Updated Product "${prod.title}" image -> ${updatedImage}`);
  }

  // 3. Update Blogs
  const blogsCol = db.collection("blogs");
  const blogs = await blogsCol.find({}).toArray();
  for (const blog of blogs) {
    const updatedCover = replaceUrl(blog.coverImage);
    if (updatedCover !== blog.coverImage) {
      await blogsCol.updateOne({ _id: blog._id }, { $set: { coverImage: updatedCover } });
      console.log(`Updated Blog "${blog.title}" cover -> ${updatedCover}`);
    }
  }

  // 4. Update SiteSettings
  const settingsCol = db.collection("sitesettings");
  const settings = await settingsCol.find({}).toArray();
  for (const set of settings) {
    const updatedLogo = replaceUrl(set.logo);
    if (updatedLogo !== set.logo) {
      await settingsCol.updateOne({ _id: set._id }, { $set: { logo: updatedLogo } });
      console.log(`Updated Settings logo -> ${updatedLogo}`);
    }
  }

  console.log("\nMongoDB migration to Cloudflare R2 URLs completed!");
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
