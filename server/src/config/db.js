const mongoose = require("mongoose");

async function connectToDatabase(mongoUri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

module.exports = { connectToDatabase };

