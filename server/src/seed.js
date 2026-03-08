const bcrypt = require("bcryptjs");
const { env } = require("./config/env");
const { connectToDatabase } = require("./config/db");
const { Category } = require("./models/Category");
const { Herb } = require("./models/Herb");
const { Product } = require("./models/Product");
const { User } = require("./models/User");

async function upsertCategory({ name, slug, parentId = null }) {
  return Category.findOneAndUpdate(
    { slug },
    { $set: { name, slug, parentId } },
    { new: true, upsert: true }
  );
}

async function upsertHerb(doc) {
  return Herb.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { new: true, upsert: true });
}

async function upsertProduct(doc) {
  return Product.findOneAndUpdate(
    { slug: doc.slug },
    { $set: doc },
    { new: true, upsert: true }
  );
}

async function main() {
  if (!env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.error("Missing MONGODB_URI in server/.env");
    process.exit(1);
  }

  await connectToDatabase(env.MONGODB_URI);

  // Admin User
  const adminEmail = "admin@herbify.com";
  const adminPassword = "adminpassword123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      $set: {
        name: "Admin",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin",
      },
    },
    { upsert: true, new: true }
  );

  const herbalTea = await upsertCategory({ name: "Herbal Tea", slug: "herbal-tea" });
  const oils = await upsertCategory({ name: "Oils", slug: "oils" });

  const tulsiTeaCat = await upsertCategory({
    name: "Tulsi Tea",
    slug: "tulsi-tea",
    parentId: herbalTea._id,
  });
  const gingerTeaCat = await upsertCategory({
    name: "Ginger Tea",
    slug: "ginger-tea",
    parentId: herbalTea._id,
  });
  const neemOilCat = await upsertCategory({
    name: "Neem Oil",
    slug: "neem-oil",
    parentId: oils._id,
  });

  await upsertHerb({
    name: "Tulsi",
    slug: "tulsi",
    shortDescription: "Medicinal herb for immunity",
    description:
      "Tulsi is known as the Queen of Herbs. It is widely used in Ayurveda for immunity and respiratory health.",
    uses: ["Used for cold & cough", "Improves immunity", "Reduces stress"],
    benefits: ["Anti-bacterial", "Anti-inflammatory", "Detoxifies body"],
    price: 199,
    stock: 100,
    images: [],
  });

  await upsertHerb({
    name: "Ginger",
    slug: "ginger",
    shortDescription: "Common herb for digestion",
    description:
      "Ginger is used traditionally for digestion support and as a warming herb in many preparations.",
    uses: ["Supports digestion", "Soothes nausea", "Warming remedy"],
    benefits: ["Anti-inflammatory", "Antioxidant support"],
    price: 149,
    stock: 120,
    images: [],
  });

  await upsertHerb({
    name: "Neem",
    slug: "neem",
    shortDescription: "Known for skin and detox support",
    description:
      "Neem is commonly used in traditional systems for skin care and general wellness support.",
    uses: ["Skin support", "Traditional cleansing"],
    benefits: ["Anti-bacterial", "Supports healthy skin"],
    price: 179,
    stock: 80,
    images: [],
  });

  await upsertProduct({
    name: "Tulsi Tea",
    slug: "tulsi-tea",
    description: "A soothing tulsi blend for everyday wellness.",
    ingredients: ["Tulsi leaves", "Lemongrass"],
    price: 249,
    stock: 40,
    images: [],
    categoryId: tulsiTeaCat._id,
    tags: ["tea", "tulsi"],
  });

  await upsertProduct({
    name: "Ginger Tea",
    slug: "ginger-tea",
    description: "A warming ginger blend crafted for digestion support.",
    ingredients: ["Ginger", "Black pepper", "Lemongrass"],
    price: 219,
    stock: 55,
    images: [],
    categoryId: gingerTeaCat._id,
    tags: ["tea", "ginger"],
  });

  await upsertProduct({
    name: "Neem Oil",
    slug: "neem-oil",
    description: "Cold-pressed neem oil for skin and hair care routines.",
    ingredients: ["Neem oil"],
    price: 299,
    stock: 25,
    images: [],
    categoryId: neemOilCat._id,
    tags: ["oil", "neem"],
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

