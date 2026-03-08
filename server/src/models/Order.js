const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    itemType: { type: String, enum: ["herb", "product"], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    slug: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    qty: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    addressLine1: { type: String, required: true, trim: true, maxlength: 240 },
    addressLine2: { type: String, default: "", trim: true, maxlength: 240 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    pincode: { type: String, required: true, trim: true, maxlength: 12 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: addressSchema, required: true },

    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },

    paymentProvider: { type: String, enum: ["razorpay"], default: "razorpay" },
    paymentStatus: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };

