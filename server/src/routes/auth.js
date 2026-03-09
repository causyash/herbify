const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const { User } = require("../models/User");
const { OTP } = require("../models/OTP");
const { generateOTP, sendOTPEmail } = require("../utils/otpService");
const { signAccessToken } = require("../utils/jwt");
const { accessCookieOptions } = require("../utils/cookies");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(320),
  password: z.string().min(6).max(200),
});

const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(6).max(200),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: "user", isVerified: false });

  // Send OTP
  const code = generateOTP();
  await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  await sendOTPEmail(email, code);

  res.status(201).json({
    message: "User registered. Please verify your email with the OTP sent.",
    email: user.email,
  });
});

router.post("/verify-otp", async (req, res) => {
  const parsed = z.object({ email: z.string().email(), code: z.string().length(6) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const email = parsed.data.email.toLowerCase();
  const { code } = parsed.data;
  const otpDoc = await OTP.findOne({ email, code });

  if (!otpDoc) {
    // eslint-disable-next-line no-console
    console.warn(`OTP verification failed for ${email}. Code: ${code}`);
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await User.findOneAndUpdate({ email }, { $set: { isVerified: true } });
  await OTP.deleteMany({ email });

  const user = await User.findOne({ email });
  const token = signAccessToken({ sub: String(user._id), role: user.role });
  res.cookie("access_token", token, accessCookieOptions());

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

router.post("/resend-otp", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const code = generateOTP();
  await OTP.deleteMany({ email });
  await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  await sendOTPEmail(email, code);

  res.json({ message: "OTP resent successfully" });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { password } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  if (user.role !== "admin") {
    // Send OTP for every user login
    const code = generateOTP();
    await OTP.deleteMany({ email: user.email });
    await OTP.create({ email: user.email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTPEmail(user.email, code);

    return res.status(403).json({
      message: "Please enter the OTP sent to your email to continue.",
      email: user.email,
      requiresVerification: true,
    });
  }

  const token = signAccessToken({ sub: String(user._id), role: user.role });
  res.cookie("access_token", token, accessCookieOptions());
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

router.post("/logout", async (req, res) => {
  res.clearCookie("access_token", accessCookieOptions());
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { authRouter: router };

