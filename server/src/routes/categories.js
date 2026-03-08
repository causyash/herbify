const express = require("express");
const { Category } = require("../models/Category");

const router = express.Router();

function toNode(cat) {
  return {
    id: String(cat._id),
    name: cat.name,
    slug: cat.slug,
    parentId: cat.parentId ? String(cat.parentId) : null,
    children: [],
  };
}

router.get("/", async (req, res) => {
  const cats = await Category.find({}).sort({ name: 1 }).lean();
  const byId = new Map();
  const roots = [];

  for (const c of cats) byId.set(String(c._id), toNode(c));

  for (const c of cats) {
    const node = byId.get(String(c._id));
    if (c.parentId) {
      const parent = byId.get(String(c.parentId));
      if (parent) parent.children.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  }

  res.json({ categories: roots });
});

module.exports = { categoriesRouter: router };

