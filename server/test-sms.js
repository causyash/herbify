const { sendAdminSMS } = require("./src/utils/smsService");

async function runTest() {
  console.log("--- Starting Telegram Notification Test ---");
  const success = await sendAdminSMS("🚀 <b>Herbify Test</b>\n\nYour notification system is working perfectly!");
  
  if (success) {
    console.log("--- Test Result: SUCCESS (Message sent to Telegram) ---");
  } else {
    console.log("--- Test Result: FAILED (Check logs above for reason) ---");
  }
}

runTest();
