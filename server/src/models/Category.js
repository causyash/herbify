const mongoose = require("mongoose");
const { toSlug } = require("../utils/slug");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1, name: 1 });

categorySchema.pre("validate", function preValidate() {
  if (!this.slug && this.name) this.slug = toSlug(this.name);
});

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };

