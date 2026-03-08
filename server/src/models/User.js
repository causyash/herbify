const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    cartItems: {
      type: [
        {
          itemType: { type: String, enum: ["herb", "product"], required: true },
          itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
          slug: { type: String, required: true, trim: true },
          name: { type: String, required: true, trim: true },
          price: { type: Number, required: true, min: 0 },
          image: { type: String, default: "" },
          qty: { type: Number, required: true, min: 1, max: 99 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };

