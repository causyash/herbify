const express = require("express");
const { z } = require("zod");
const { Product } = require("../models/Product");
const { Category } = require("../models/Category");

const router = express.Router();

const listSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(), // category slug
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

router.get("/", async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ message: "Invalid query" });
  const { q, category, page, limit } = parsed.data;

  const filter = {};
  if (q) filter.name = new RegExp(q, "i");
  if (category) {
    const cat = await Category.findOne({ slug: category }).select("_id").lean();
    filter.categoryId = cat?._id || null;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id name slug price images stock categoryId createdAt")
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({ items, page, limit, total });
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate({ path: "categoryId", select: "name slug parentId" })
    .lean();
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
});

module.exports = { productsRouter: router };

