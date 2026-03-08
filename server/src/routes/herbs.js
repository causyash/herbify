const express = require("express");
const { z } = require("zod");
const { Herb } = require("../models/Herb");

const router = express.Router();

const listSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

router.get("/", async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ message: "Invalid query" });
  const { q, page, limit } = parsed.data;

  const filter = {};
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { shortDescription: new RegExp(q, "i") }];

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Herb.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id name slug shortDescription price images stock createdAt")
      .lean(),
    Herb.countDocuments(filter),
  ]);

  res.json({ items, page, limit, total });
});

router.get("/:slug", async (req, res) => {
  const herb = await Herb.findOne({ slug: req.params.slug }).lean();
  if (!herb) return res.status(404).json({ message: "Herb not found" });
  res.json({ herb });
});

module.exports = { herbsRouter: router };

