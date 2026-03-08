const express = require("express");
const { z } = require("zod");
const { ContactMessage } = require("../models/ContactMessage");

const router = express.Router();

router.post("/", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().min(2).max(120),
      email: z.string().email().max(320),
      message: z.string().min(5).max(5000),
    })
    .safeParse(req.body);

  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const msg = await ContactMessage.create({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    status: "new",
  });

  const { sendAdminSMS } = require("../utils/smsService");
  sendAdminSMS(`Herbify: New Contact Message!\nName: ${msg.name}\nEmail: ${msg.email}\nMessage: ${msg.message}`).catch(err => console.error("Telegram background error:", err));

  res.status(201).json({ ok: true, id: String(msg._id) });
});

module.exports = { contactRouter: router };

