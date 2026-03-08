const mongoose = require("mongoose");
const { toSlug } = require("../utils/slug");

const herbSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 280 },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    uses: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

herbSchema.index({ slug: 1 }, { unique: true });
herbSchema.index({ name: 1 });

herbSchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
  next();
});

const Herb = mongoose.model("Herb", herbSchema);

module.exports = { Herb };

