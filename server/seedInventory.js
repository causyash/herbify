require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { Category } = require("./src/models/Category");
const { Herb } = require("./src/models/Herb");
const { Product } = require("./src/models/Product");

const categories = [
  { name: "Raw & Dried Herbs" },
  { name: "Herbal Teas & Infusions" },
  { name: "Essential Oils & Extracts" },
  { name: "Natural Supplements" },
  { name: "Skincare & Topicals" },
  { name: "Superfoods & Powders" }
];

const herbsData = [
  {
    name: "Organic Ashwagandha Root",
    shortDescription: "Premium dried Ashwagandha roots for stress relief.",
    description: "Premium dried Ashwagandha roots (*Withania somnifera*). Known extensively for its adaptogenic properties to help the body manage stress, combat fatigue, and boost energy safely.",
    price: 450,
    stock: 100,
    images: ["/demo/ashwagandha.png"], // Reference local demo image
    uses: ["Grind into tea", "Mix into superfood bowls"],
    benefits: ["Adaptogenic stress relief", "Combats fatigue"]
  },
  {
    name: "Dried Peppermint Leaves",
    shortDescription: "High-quality, intensely aromatic dried peppermint leaves.",
    description: "High-quality, intensely aromatic dried peppermint leaves. Perfect for soothing digestion, relieving headaches, and brewing your own refreshing natural teas.",
    price: 250,
    stock: 200,
    images: ["/demo/peppermint.png"],
    uses: ["Tea brewing", "Culinary garnish"],
    benefits: ["Soothing digestion", "Relieves mild headaches"]
  },
  {
    name: "Premium Turmeric Root",
    shortDescription: "Sun-dried organic whole turmeric root.",
    description: "Sun-dried organic whole turmeric root. Rich in active curcumin, offering profound anti-inflammatory and antioxidant benefits for your diet.",
    price: 300,
    stock: 150,
    images: ["/demo/turmeric.png"],
    uses: ["Cooking additive", "Golden milk teas"],
    benefits: ["Anti-inflammatory properties", "Potent antioxidant"]
  }
];

const productsData = [
  {
    name: "Sleep Well Chamomile Blend",
    categoryName: "Herbal Teas & Infusions",
    description: "A calming, caffeine-free bedtime blend of organic chamomile flowers, lavender petals, and lemon balm designed to promote deep, restless-free sleep.",
    price: 350,
    stock: 50,
    images: ["/demo/chamomile.png"] // Reference local demo image
  },
  {
    name: "Detoxifying Green Tea & Mint",
    categoryName: "Herbal Teas & Infusions",
    description: "Refreshing authentic Darjeeling green tea expertly blended with crushed mint leaves for a perfect morning detox and daily metabolism boost.",
    price: 290,
    stock: 80,
    images: ["/demo/greentea.png"]
  },
  {
    name: "Pure Lavender Essential Oil (15ml)",
    categoryName: "Essential Oils & Extracts",
    description: "100% pure, therapeutic-grade lavender oil. Diffuse to relieve anxiety, or apply topically (when safely diluted) to soothe skin irritations and promote relaxation.",
    price: 650,
    stock: 40,
    images: ["/demo/lavender.png"]
  },
  {
    name: "Brahmi (Bacopa) Memory Capsules",
    categoryName: "Natural Supplements",
    description: "Natural cognitive enhancer capsules derived from pure Brahmi extract to improve focus, sharpen memory, and gently reduce daily anxiety.",
    price: 750,
    stock: 30,
    images: ["/demo/brahmi.png"]
  },
  {
    name: "Aloe Vera & Neem Healing Gel",
    categoryName: "Skincare & Topicals",
    description: "A cooling, naturally antibacterial gel integrating pure Aloe Vera and Neem extract to clear stubborn acne, deeply hydrate skin, and soothe sunburns without harsh chemicals.",
    price: 400,
    stock: 120,
    images: ["/demo/aloeneem.png"]
  },
  {
    name: "Organic Moringa Powder",
    categoryName: "Superfoods & Powders",
    description: "The ultimate 'miracle tree' superfood base. Packed to the brim with essential vitamins, iron, and protein. Perfect for whisking into morning smoothies or directly in water.",
    price: 380,
    stock: 90,
    images: ["/demo/moringa.png"]
  }
];

async function runSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Inserting Categories...");
    const createdCategories = {};
    for (const cat of categories) {
      let doc = await Category.findOne({ name: cat.name });
      if (!doc) doc = await Category.create(cat);
      createdCategories[doc.name] = doc._id;
    }

    console.log("Inserting Herbs...");
    for (const herb of herbsData) {
      let doc = await Herb.findOne({ name: herb.name });
      if (!doc) await Herb.create(herb);
      else {
        await Herb.updateOne({ _id: doc._id }, { $set: { images: herb.images } });
        console.log(`Herb ${herb.name} updated with images.`);
      }
    }

    console.log("Inserting Products...");
    for (const p of productsData) {
      const catId = createdCategories[p.categoryName];
      if (!catId) {
        console.warn(`Category not found for product: ${p.categoryName}`);
        continue;
      }

      let doc = await Product.findOne({ name: p.name });
      if (!doc) {
        await Product.create({
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          images: p.images,
          categoryId: catId
        });
      } else {
        await Product.updateOne({ _id: doc._id }, { $set: { images: p.images } });
        console.log(`Product ${p.name} updated with images.`);
      }
    }

    console.log("✅ Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeed();
