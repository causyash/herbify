require("dotenv").config({ path: "./server/.env" });
const mongoose = require("mongoose");
const { User } = require("./server/src/models/User");

async function makeAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("❌ ERROR: Please provide an email address.");
    console.log("Usage: node makeAdmin.js your_email@example.com");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not set in your server/.env file.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { role: "admin", isVerified: true } },
      { new: true }
    );
    
    if (user) {
      console.log(`\n✅ SUCCESS: User ${user.email} is now an ADMIN and automatically verified!`);
      console.log("You can now login successfully without needing an OTP.");
    } else {
      console.log(`\n❌ ERROR: No user found in the database with email: ${email}`);
      console.log("Make sure you registered an account on the website first.");
    }
  } catch (err) {
    console.error("\n❌ Database Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
