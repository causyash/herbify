/**
 * Script to upload generated images to Cloudinary and
 * then patch the MongoDB herb/product records with the URLs.
 * Run from the /server directory: node upload-images.js
 */
require("dotenv").config();
const { env } = require("./src/config/env");
const { connectToDatabase } = require("./src/config/db");
const { Herb } = require("./src/models/Herb");
const { Product } = require("./src/models/Product");
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Update these paths to where the generated images are saved
const BRAIN_DIR = "/Users/yash/.gemini/antigravity/brain/a7d3fcc4-06f2-4f35-9f8e-d93b3511bd65";

const HERB_IMAGES = {
  "tulsi": path.join(BRAIN_DIR, "tulsi_herb_1773143470099.png"),
  "ginger": path.join(BRAIN_DIR, "ginger_herb_1773143500222.png"),
  "neem": path.join(BRAIN_DIR, "neem_herb_1773143519634.png"),
};

const PRODUCT_IMAGES = {
  "tulsi-tea": path.join(BRAIN_DIR, "tulsi_tea_product_1773143543084.png"),
  "ginger-tea": path.join(BRAIN_DIR, "ginger_tea_product_1773143567320.png"),
  "neem-oil": path.join(BRAIN_DIR, "neem_oil_product_1773143764397.png"),
};

async function uploadImage(filePath, publicId) {
  console.log(`Uploading ${publicId}...`);
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "herbify",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  console.log(`  ✓ Uploaded: ${result.secure_url}`);
  return result.secure_url;
}

async function main() {
  await connectToDatabase(env.MONGODB_URI);

  // Upload and update herbs
  for (const [slug, filePath] of Object.entries(HERB_IMAGES)) {
    const url = await uploadImage(filePath, `herb-${slug}`);
    const res = await Herb.findOneAndUpdate(
      { slug },
      { $set: { images: [url] } },
      { new: true }
    );
    if (res) console.log(`  ✓ Updated herb "${slug}" in DB`);
    else console.warn(`  ⚠ Herb "${slug}" not found in DB`);
  }

  // Upload and update products
  for (const [slug, filePath] of Object.entries(PRODUCT_IMAGES)) {
    const url = await uploadImage(filePath, `product-${slug}`);
    const res = await Product.findOneAndUpdate(
      { slug },
      { $set: { images: [url] } },
      { new: true }
    );
    if (res) console.log(`  ✓ Updated product "${slug}" in DB`);
    else console.warn(`  ⚠ Product "${slug}" not found in DB`);
  }

  console.log("\n🎉 All images uploaded and DB updated!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
