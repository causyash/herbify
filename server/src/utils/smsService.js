const axios = require("axios");
const { env } = require("../config/env");

/**
 * Send notification to admin using Telegram Bot (100% Free & Reliable)
 */
async function sendAdminSMS(message) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    // eslint-disable-next-line no-console
    console.warn("Telegram Bot Token or Chat ID not set. Mocking notification to console.");
    // eslint-disable-next-line no-console
    console.log(`
    -----------------------------------------
    [NOTIFICATION MOCKED]
    Message: ${message}
    -----------------------------------------
    `);
    return true;
  }

  try {
    const response = await axios.post(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });

    if (response.data.ok) {
      // eslint-disable-next-line no-console
      console.log("Telegram notification sent successfully.");
      return true;
    } else {
      // eslint-disable-next-line no-console
      console.error("Telegram API returned failure:", response.data.description);
      return false;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to send Telegram notification:", error.response?.data?.description || error.message);
    return false;
  }
}

module.exports = { sendAdminSMS };
