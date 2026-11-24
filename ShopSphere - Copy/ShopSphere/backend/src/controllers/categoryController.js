import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) { res.status(400); throw new Error("Category name is required."); }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const category = await Category.create({ name, slug });
  res.status(201).json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) { res.status(404); throw new Error("Category not found."); }
  res.json({ success: true, message: "Category deleted." });
});
