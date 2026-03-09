require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { Order } = require("./src/models/Order");
const { Product } = require("./src/models/Product");
const { Herb } = require("./src/models/Herb");

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // 1. Delete all past orders
    const deletedOrders = await Order.deleteMany({});
    console.log(`✅ Deleted ${deletedOrders.deletedCount} past orders.`);

    // 2. Delete products / herbs with no images
    const deletedProducts = await Product.deleteMany({ images: { $size: 0 } });
    console.log(`✅ Deleted ${deletedProducts.deletedCount} old products with zero images.`);
    
    // Also delete any where the images array might be utterly missing
    const deletedProductsNull = await Product.deleteMany({ images: { $in: [null, []] } });
    if(deletedProductsNull.deletedCount > 0) {
      console.log(`✅ Deleted ${deletedProductsNull.deletedCount} old products with null/empty image arrays.`);
    }

    const deletedHerbs = await Herb.deleteMany({ images: { $size: 0 } });
    console.log(`✅ Deleted ${deletedHerbs.deletedCount} old herbs with zero images.`);

    const deletedHerbsNull = await Herb.deleteMany({ images: { $in: [null, []] } });
     if(deletedHerbsNull.deletedCount > 0) {
      console.log(`✅ Deleted ${deletedHerbsNull.deletedCount} old herbs with null/empty image arrays.`);
    }

  } catch (err) {
    console.error("❌ Cleanup Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanup();
