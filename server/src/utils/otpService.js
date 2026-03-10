/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to email using Google Apps Script HTTP Bypass
 * (This entirely bypasses Render's SMTP port 465/587 blocks)
 */
async function sendOTPEmail(email, code) {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLEA7pwfDHhcRC6c7jw4yOMR3BP4anTuZ-hXEZwmXLhE5QtgcFN9aQFGiVWtRasO5J/exec";

  const htmlBody = `
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
    `;

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Your Herbify Verification Code",
        html: htmlBody,
      }),
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    if (result.error) {
        throw new Error(result.error);
    }

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("HTTP Email delivery failed:", error);
    throw error;
  }
}

module.exports = { generateOTP, sendOTPEmail };