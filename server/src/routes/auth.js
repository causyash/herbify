const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const { User } = require("../models/User");
const { OTP } = require("../models/OTP");
const { generateOTP, sendOTPEmail } = require("../utils/otpService");
const { signAccessToken, signTrustedDeviceToken, verifyTrustedDeviceToken } = require("../utils/jwt");
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
// TEMPORARY BYPASS TO SETUP ADMIN FOR DEVELOPMENT (To be removed later)
router.get("/setup-admin", async (req, res) => {
  const emailQuery = req.query.email;
  if (!emailQuery) return res.send("Please provide ?email=your_email@example.com in the URL");

  const email = emailQuery.toLowerCase().trim();
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 12);

  let admin = await User.findOne({ email });
  if (admin) {
    admin.passwordHash = passwordHash;
    admin.role = "admin";
    admin.isVerified = true;
    await admin.save();
    return res.send(`<h2>SUCCESS</h2><p>Existing account ${email} is now an ADMiN. Your password has been reset to: <b>password123</b></p><p>Go back to the website and log in!</p>`);
  } else {
    await User.create({
      name: "Admin User",
      email,
      passwordHash,
      role: "admin",
      isVerified: true
    });
    return res.send(`<h2>SUCCESS</h2><p>New admin account created for ${email}. Your password is: <b>password123</b></p><p>Go back to the website and log in!</p>`);
  }
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

  // Send OTP for normal users
  try {
    const code = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTPEmail(email, code);

    return res.status(201).json({ message: "OTP sent for verification" });
  } catch (err) {
    console.error("Failed to send OTP", err);
    return res.status(500).json({ message: "Failed to send verification email. Please try again." });
  }
});

router.post("/verify-otp", async (req, res) => {
  const parsed = z.object({ 
    email: z.string().email(), 
    code: z.string().length(6),
    rememberBrowser: z.boolean().optional()
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const email = parsed.data.email.toLowerCase();
  const { code, rememberBrowser } = parsed.data;
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

  if (rememberBrowser) {
    const trustedToken = signTrustedDeviceToken(String(user._id));
    res.cookie("trusted_device", trustedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  res.json({
    token, // Send token directly to client
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

router.post("/resend-otp", async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input" });

  const email = parsed.data.email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    const code = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTPEmail(email, code);
  } catch (err) {
    console.error("Failed to resend OTP", err);
    return res.status(500).json({ message: "Failed to send verification email. Please try again." });
  }

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
  if (!user) return res.status(400).json({ message: "Invalid credentials." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials." });

  const trustedCookie = req.cookies.trusted_device;
  const trustedUserId = trustedCookie ? verifyTrustedDeviceToken(trustedCookie) : null;
  const isTrustedBrowser = trustedUserId === String(user._id);

  if (user.role !== "admin" && !isTrustedBrowser) {
    try {
      const code = generateOTP();
      await OTP.deleteMany({ email });
      await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
      await sendOTPEmail(email, code);
      return res.status(403).json({ requiresVerification: true, message: "Please verify your email. OTP sent." });
    } catch (err) {
      console.error("Failed to send OTP", err);
      return res.status(500).json({ message: "Failed to send verification email." });
    }
  }

  // Admin or verified user: Return token directly
  const token = signAccessToken({ sub: String(user._id), role: user.role });
  res.cookie("access_token", token, accessCookieOptions());
  return res.json({
    token, // Send token directly to client
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

