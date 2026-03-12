require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { Herb } = require("./src/models/Herb");

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const herbs = await Herb.find({}).sort({ createdAt: -1 });

    console.log("HERBS:");
    herbs.forEach(h => console.log(`- ${h.name}`));

    await mongoose.disconnect();
}
run();
