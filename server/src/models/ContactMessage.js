const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "closed"], default: "new" },
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

module.exports = { ContactMessage };

