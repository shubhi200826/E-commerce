import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, required: true, maxlength: 3000 },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: null, min: 0 },
  image: { type: String, default: "https://placehold.co/600x600?text=ShopSphere" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: "text", description: "text" });
export default mongoose.model("Product", productSchema);
