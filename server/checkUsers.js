const mongoose = require("mongoose");
const { User } = require("./src/models/User");
const bcrypt = require("bcryptjs");

async function setup() {
  try {
    const uri = "mongodb+srv://weee:weee6969@cluster.3lju1rk.mongodb.net/?appName=Cluster";
    await mongoose.connect(uri);
    const users = await User.find({}, "email role isVerified");
    console.log("Current Users in DB:");
    users.forEach(u => console.log(`- ${u.email} [${u.role}] (Verified: ${u.isVerified})`));

    const email = "admin@herbify.com";
    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 12);

    let admin = await User.findOne({ email });
    if (admin) {
      admin.passwordHash = passwordHash;
      admin.role = "admin";
      admin.isVerified = true;
      await admin.save();
      console.log(`\n✅ Updated existing admin account ${email}`);
    } else {
      admin = await User.create({
        name: "Admin User",
        email,
        passwordHash,
        role: "admin",
        isVerified: true
      });
      console.log(`\n✅ Created new admin account ${email}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

setup();
