const express = require("express");
const { z } = require("zod");
const { requireAuth } = require("../middleware/auth");
const { User } = require("../models/User");

const router = express.Router();

const cartItemSchema = z.object({
  itemType: z.enum(["herb", "product"]),
  itemId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1).max(200),
  price: z.number().min(0),
  image: z.string().optional().default(""),
  qty: z.number().int().min(1).max(99),
});

router.get("/", requireAuth, async (req, res) => {
  res.json({ items: req.user.cartItems || [] });
});

router.put("/", requireAuth, async (req, res) => {
  const parsed = z.object({ items: z.array(cartItemSchema).max(200) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid cart" });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        cartItems: parsed.data.items.map((i) => ({
          ...i,
          itemId: i.itemId,
          image: i.image || "",
        })),
      },
    },
    { new: true, runValidators: true }
  ).select("-passwordHash");

  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json({ items: updatedUser.cartItems });
});

module.exports = { cartRouter: router };

