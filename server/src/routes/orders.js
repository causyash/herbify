const express = require("express");
const { z } = require("zod");

const { requireAuth } = require("../middleware/auth");
const { Order } = require("../models/Order");
const { Herb } = require("../models/Herb");
const { Product } = require("../models/Product");

const router = express.Router();

const addressSchema = z.object({
  fullName: z.string().min(2).max(160),
  phone: z.string().min(6).max(30),
  addressLine1: z.string().min(3).max(240),
  addressLine2: z.string().max(240).optional().default(""),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().min(3).max(12),
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = z.object({ shippingAddress: addressSchema }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const cart = req.user.cartItems || [];
  if (!cart.length) return res.status(400).json({ message: "Cart is empty" });

  for (const it of cart) {
    const Model = it.itemType === "herb" ? Herb : Product;
    const doc = await Model.findById(it.itemId);
    if (!doc) return res.status(400).json({ message: `Item ${it.name} not found` });
    if (doc.stock < it.qty) return res.status(400).json({ message: `Not enough stock for ${it.name}. Only ${doc.stock} left.` });
  }

  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const order = await Order.create({
    userId: req.user._id,
    items: cart.map((it) => ({
      itemType: it.itemType,
      itemId: it.itemId,
      slug: it.slug,
      name: it.name,
      price: it.price,
      image: it.image || "",
      qty: it.qty,
    })),
    shippingAddress: parsed.data.shippingAddress,
    subtotal,
    shippingFee,
    total,
    paymentProvider: "razorpay",
    paymentStatus: "created",
    orderStatus: "placed",
  });

  res.status(201).json({ order });
});

router.get("/my", requireAuth, async (req, res) => {
  const items = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("-razorpaySignature")
    .lean();
  res.json({ items });
});

router.get("/:id", requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id).select("-razorpaySignature").lean();
  if (!order) return res.status(404).json({ message: "Order not found" });
  const isOwner = String(order.userId) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });
  res.json({ order });
});

module.exports = { ordersRouter: router };

