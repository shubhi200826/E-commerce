import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ success: true, cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const amount = Number(quantity);
  if (!Number.isInteger(amount) || amount < 1) { res.status(400); throw new Error("Quantity must be a positive integer."); }
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) { res.status(404); throw new Error("Product not found."); }
  if (product.stock < amount) { res.status(400); throw new Error("Not enough stock available."); }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const item = cart.items.find((entry) => entry.product.toString() === productId);
  if (item) item.quantity += amount;
  else cart.items.push({ product: productId, quantity: amount });
  if (item && item.quantity > product.stock) { res.status(400); throw new Error("Requested quantity exceeds stock."); }
  await cart.save();
  await cart.populate("items.product");
  res.json({ success: true, cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) { res.status(400); throw new Error("Quantity must be at least 1."); }
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart?.items.find((entry) => entry.product.toString() === req.params.productId);
  if (!item) { res.status(404); throw new Error("Cart item not found."); }
  const product = await Product.findById(req.params.productId);
  if (!product || quantity > product.stock) { res.status(400); throw new Error("Requested quantity is unavailable."); }
  item.quantity = quantity;
  await cart.save(); await cart.populate("items.product");
  res.json({ success: true, cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Cart not found."); }
  cart.items = cart.items.filter((entry) => entry.product.toString() !== req.params.productId);
  await cart.save(); await cart.populate("items.product");
  res.json({ success: true, cart });
});
