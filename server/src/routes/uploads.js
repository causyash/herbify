const express = require("express");
const { z } = require("zod");

const { requireAuth, requireAdmin } = require("../middleware/auth");
const { env } = require("../config/env");
const { cloudinary, configureCloudinary } = require("../config/cloudinary");

const router = express.Router();

router.post("/signature", requireAuth, requireAdmin, async (req, res) => {
  configureCloudinary();
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: "Cloudinary is not configured" });
  }

  const parsed = z
    .object({
      folder: z.string().min(1).max(200).optional().default("herbify"),
    })
    .safeParse(req.body || {});

  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    folder: parsed.data.folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET);
  res.json({
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    folder: parsed.data.folder,
    signature,
  });
});

module.exports = { uploadsRouter: router };

