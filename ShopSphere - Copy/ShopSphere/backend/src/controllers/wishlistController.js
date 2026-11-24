import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  res.json({ success: true, wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId, isActive: true });
  if (!product) { res.status(404); throw new Error("Product not found."); }
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  const exists = wishlist.products.some((id) => id.toString() === req.params.productId);
  wishlist.products = exists
    ? wishlist.products.filter((id) => id.toString() !== req.params.productId)
    : [...wishlist.products, product._id];
  await wishlist.save(); await wishlist.populate("products");
  res.json({ success: true, wishlist });
});
