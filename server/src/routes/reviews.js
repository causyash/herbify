const express = require("express");
const { z } = require("zod");
const { requireAuth } = require("../middleware/auth");
const { Review } = require("../models/Review");
const { Product } = require("../models/Product");
const { Herb } = require("../models/Herb");

const router = express.Router();

const postReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().max(1000).optional().default(""),
});

router.get("/:itemType/:itemId", async (req, res) => {
  const { itemType, itemId } = req.params;
  if (!["product", "herb"].includes(itemType)) {
    return res.status(400).json({ message: "Invalid item type" });
  }

  try {
    const reviews = await Review.find({ itemType, itemId })
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .lean();
    
    // Calculate stats
    const totalReviews = reviews.length;
    let averageRating = 0;
    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = sum / totalReviews;
    }

    res.json({ 
      reviews, 
      stats: { totalReviews, averageRating: Number(averageRating.toFixed(1)) } 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

router.post("/:itemType/:itemId", requireAuth, async (req, res) => {
  const { itemType, itemId } = req.params;
  if (!["product", "herb"].includes(itemType)) {
    return res.status(400).json({ message: "Invalid item type" });
  }

  const parsed = postReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  try {
    // Check if item exists
    const Model = itemType === "product" ? Product : Herb;
    const itemExists = await Model.exists({ _id: itemId });
    if (!itemExists) return res.status(404).json({ message: "Item not found" });

    // Ensure user hasn't already reviewed this item
    const existing = await Review.findOne({
      userId: req.user._id,
      itemType,
      itemId,
    });
    
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this item" });
    }

    const review = await Review.create({
      userId: req.user._id,
      itemType,
      itemId,
      rating: parsed.data.rating,
      text: parsed.data.text,
    });

    // Return the inserted review with user populated
    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name")
      .lean();

    res.status(201).json({ review: populatedReview });
  } catch (err) {
    res.status(500).json({ message: "Error creating review" });
  }
});

module.exports = { reviewsRouter: router };
