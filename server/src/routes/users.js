const express = require("express");
const { z } = require("zod");
const { requireAuth } = require("../middleware/auth");
const { User } = require("../models/User");

const router = express.Router();

const addressSchema = z.object({
  _id: z.string().optional(),
  label: z.string().min(1).max(50).default("Home"),
  fullName: z.string().min(2).max(160),
  phone: z.string().min(6).max(30),
  addressLine1: z.string().min(3).max(240),
  addressLine2: z.string().max(240).optional().default(""),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().min(3).max(12),
});

router.put("/me/addresses", requireAuth, async (req, res) => {
  const parsed = z.object({ addresses: z.array(addressSchema) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", details: parsed.error });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.addresses = parsed.data.addresses;
  await user.save();

  res.json({ addresses: user.addresses });
});

module.exports = { usersRouter: router };
