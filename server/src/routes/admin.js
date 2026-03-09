const express = require("express");
const { z } = require("zod");

const { requireAuth, requireAdmin } = require("../middleware/auth");
const { Category } = require("../models/Category");
const { Herb } = require("../models/Herb");
const { Product } = require("../models/Product");
const { ContactMessage } = require("../models/ContactMessage");
const { Order } = require("../models/Order");
const { User } = require("../models/User");

const router = express.Router();
router.use(requireAuth, requireAdmin);

function dupKey(res, err) {
  if (err && err.code === 11000) return res.status(409).json({ message: "Duplicate key" });
  throw err;
}

// Categories
router.get("/categories", async (req, res) => {
  const items = await Category.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.post("/categories", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(120),
      slug: z.string().min(1).max(140).optional(),
      parentId: z.string().nullable().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    const doc = await Category.create({
      name: parsed.data.name,
      slug: parsed.data.slug,
      parentId: parsed.data.parentId || null,
    });
    res.status(201).json({ item: doc });
  } catch (err) {
    return dupKey(res, err);
  }
});

router.put("/categories/:id", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(120),
      slug: z.string().min(1).max(140).optional(),
      parentId: z.string().nullable().optional(),
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    const doc = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: parsed.data.name,
          ...(parsed.data.slug ? { slug: parsed.data.slug } : {}),
          parentId: parsed.data.parentId || null,
        },
      },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ item: doc });
  } catch (err) {
    return dupKey(res, err);
  }
});

router.delete("/categories/:id", async (req, res) => {
  const doc = await Category.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

// Herbs
router.get("/herbs", async (req, res) => {
  const items = await Herb.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.post("/herbs", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(160),
      slug: z.string().min(1).max(180).optional(),
      shortDescription: z.string().min(2).max(280),
      description: z.string().min(2).max(8000),
      uses: z.array(z.string().min(1).max(200)).optional().default([]),
      benefits: z.array(z.string().min(1).max(200)).optional().default([]),
      price: z.number().min(0),
      stock: z.number().int().min(0).optional().default(0),
      images: z.array(z.string().url()).optional().default([]),
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    const doc = await Herb.create(parsed.data);
    res.status(201).json({ item: doc });
  } catch (err) {
    return dupKey(res, err);
  }
});

router.put("/herbs/:id", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(160),
      slug: z.string().min(1).max(180).optional(),
      shortDescription: z.string().min(2).max(280),
      description: z.string().min(2).max(8000),
      uses: z.array(z.string().min(1).max(200)).optional().default([]),
      benefits: z.array(z.string().min(1).max(200)).optional().default([]),
      price: z.number().min(0),
      stock: z.number().int().min(0).optional().default(0),
      images: z.array(z.string().url()).optional().default([]),
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    const doc = await Herb.findByIdAndUpdate(req.params.id, { $set: parsed.data }, { new: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ item: doc });
  } catch (err) {
    return dupKey(res, err);
  }
});

router.delete("/herbs/:id", async (req, res) => {
  const doc = await Herb.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

// Products
router.get("/products", async (req, res) => {
  const items = await Product.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "categoryId", select: "name slug parentId" })
    .lean();
  res.json({ items });
});

router.post("/products", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(160),
      slug: z.string().min(1).max(180).optional(),
      description: z.string().min(2).max(8000),
      ingredients: z.array(z.string().min(1).max(200)).optional().default([]),
      price: z.number().min(0),
      stock: z.number().int().min(0).optional().default(0),
      images: z.array(z.string().url()).optional().default([]),
      categoryId: z.string().min(1),
      tags: z.array(z.string().min(1).max(60)).optional().default([]),
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    const doc = await Product.create(parsed.data);
    res.status(201).json({ item: doc });
  } catch (err) {
    return dupKey(res, err);
  }
});

router.put("/products/:id", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(160),
      slug: z.string().min(1).max(180).optional(),
      description: z.string().min(2).max(8000),
      ingredients: z.array(z.string().min(1).max(200)).optional().default([]),
      price: z.number().min(0),
      stock: z.number().int().min(0).optional().default(0),
      images: z.array(z.string().url()).optional().default([]),
      categoryId: z.string().min(1),
      tags: z.array(z.string().min(1).max(60)).optional().default([]),
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    const doc = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ item: doc });
  } catch (err) {
    return dupKey(res, err);
  }
});

router.delete("/products/:id", async (req, res) => {
  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

// Contacts
router.get("/contacts", async (req, res) => {
  const items = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.patch("/contacts/:id/status", async (req, res) => {
  const parsed = z
    .object({ status: z.enum(["new", "closed"]) })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const doc = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { $set: { status: parsed.data.status } },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ item: doc });
});

// Orders
router.get("/orders", async (req, res) => {
  const items = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();
  res.json({ items });
});

router.get("/bestsellers", async (req, res) => {
  try {
    const { category } = req.query;
    
    // Aggregate all order items to find top sellers
    const pipeline = [
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.itemId",
          name: { $first: "$items.name" },
          itemType: { $first: "$items.itemType" },
          price: { $first: "$items.price" },
          totalSold: { $sum: "$items.qty" }
        }
      },
      { $sort: { totalSold: -1 } },
      // Cap at top 50 to keep it manageable before filtering further
      { $limit: 50 }
    ];

    const bestsellers = await Order.aggregate(pipeline);
    
    // We need to fetch current stock and category info
    const productIds = bestsellers.filter(b => b.itemType === 'product').map(b => b._id);
    const herbIds = bestsellers.filter(b => b.itemType === 'herb').map(b => b._id);

    const [products, herbs] = await Promise.all([
      Product.find({ _id: { $in: productIds } }).select("stock categoryId name images _id").lean(),
      Herb.find({ _id: { $in: herbIds } }).select("stock name images _id").lean()
    ]);
    
    // Build a map for quick lookup
    const itemDataMap = {};
    products.forEach(p => itemDataMap[p._id.toString()] = { stock: p.stock, categoryId: p.categoryId, images: p.images });
    herbs.forEach(h => itemDataMap[h._id.toString()] = { stock: h.stock, categoryId: null, images: h.images }); // Herbs don't have categories in schema

    // Merge and filter
    let finalBestsellers = bestsellers.map(b => {
      const data = itemDataMap[b._id.toString()] || { stock: 0, categoryId: null, images: [] };
      return {
        ...b,
        stock: data.stock,
        categoryId: data.categoryId,
        image: data.images[0] || ''
      };
    });

    // Optionally filter by category if provided. Herbs don't have categories so they drop out if a category is filtered.
    if (category) {
      finalBestsellers = finalBestsellers.filter(b => 
        b.categoryId && b.categoryId.toString() === category
      );
    }
    
    res.json({ items: finalBestsellers.slice(0, 10) }); // Send top 10 after filter
  } catch (err) {
    console.error("Bestseller aggregation error", err);
    res.status(500).json({ message: "Failed to fetch bestsellers" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  const parsed = z
    .object({ orderStatus: z.enum(["placed", "processing", "shipped", "delivered", "cancelled"]) })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const doc = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { orderStatus: parsed.data.orderStatus } },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ item: doc });
});

// Users
router.get("/users", async (req, res) => {
  const items = await User.find({}).select("-passwordHash").sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.patch("/users/:id/role", async (req, res) => {
  const parsed = z
    .object({ role: z.enum(["user", "admin"]) })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const doc = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { role: parsed.data.role } },
    { new: true }
  ).select("-passwordHash");
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ item: doc });
});

router.delete("/users/:id", async (req, res) => {
  // Prevent admin from deleting themselves? Let's just allow it or rely on client side to hide the button.
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ message: "Cannot delete yourself" });
  }

  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

module.exports = { adminRouter: router };

