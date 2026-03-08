const mongoose = require("mongoose");
const { toSlug } = require("../utils/slug");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    ingredients: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ categoryId: 1, price: 1 });
productSchema.index({ name: 1 });

productSchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };

