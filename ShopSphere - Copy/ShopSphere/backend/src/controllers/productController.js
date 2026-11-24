import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { search = "", category, sort = "newest", page = 1, limit = 12 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search.trim()) filter.$text = { $search: search.trim() };
  const sortOptions = {
    newest: { createdAt: -1 }, price_asc: { price: 1 },
    price_desc: { price: -1 }, name: { name: 1 }
  };
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const [products, total] = await Promise.all([
    Product.find(filter).populate("category", "name slug")
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip((safePage - 1) * safeLimit).limit(safeLimit),
    Product.countDocuments(filter)
  ]);
  res.json({ success: true, products, pagination: { total, page: safePage, pages: Math.ceil(total / safeLimit) } });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate("category", "name slug");
  if (!product) { res.status(404); throw new Error("Product not found."); }
  const reviews = await Review.find({ product: product._id }).populate("user", "name").sort({ createdAt: -1 });
  res.json({ success: true, product, reviews });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) { res.status(404); throw new Error("Product not found."); }
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) { res.status(404); throw new Error("Product not found."); }
  res.json({ success: true, message: "Product archived." });
});
