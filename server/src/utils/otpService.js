const nodemailer = require("nodemailer");
const dns = require("dns");
const { env } = require("../config/env");

// Force Node to use IPv4 instead of IPv6 for DNS resolution
// This fixes the ENETUNREACH crash for outgoing SMTP requests on Render
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to email using Nodemailer
 */
async function sendOTPEmail(email, code) {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error("SMTP credentials are not configured on the server. Please add SMTP_USER, SMTP_PASS, SMTP_HOST, and SMTP_PORT in the Render dashboard.");
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: "Your Herbify Verification Code",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #059669; margin-top: 0;">Verify your email</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">Welcome to Herbify! Please use the following One-Time Password (OTP) to complete your verification:</p>
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e293b;">${code}</span>
        </div>
        <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Herbify. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
}

module.exports = { generateOTP, sendOTPEmail };