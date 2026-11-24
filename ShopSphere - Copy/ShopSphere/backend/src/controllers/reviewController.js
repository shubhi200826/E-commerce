import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment = "" } = req.body;
  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    res.status(400); throw new Error("Rating must be between 1 and 5.");
  }
  if (!(await Product.findById(req.params.productId))) { res.status(404); throw new Error("Product not found."); }
  const review = await Review.findOneAndUpdate(
    { product: req.params.productId, user: req.user._id },
    { rating: Number(rating), comment },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate("user", "name");
  res.status(201).json({ success: true, review });
});
