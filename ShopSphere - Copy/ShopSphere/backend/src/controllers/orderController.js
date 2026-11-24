import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, phone } = req.body;
  if (!shippingAddress?.trim() || !phone?.trim()) {
    res.status(400); throw new Error("Shipping address and phone are required.");
  }
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || !cart.items.length) { res.status(400); throw new Error("Your cart is empty."); }

  let subtotal = 0;
  const orderItems = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product || !product.isActive || product.stock < item.quantity) {
      res.status(400); throw new Error(`${item.product.name} is no longer available in the requested quantity.`);
    }
    subtotal += product.price * item.quantity;
    orderItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, quantity: item.quantity });
  }

  for (const item of cart.items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }, { new: true }
    );
    if (!updated) { res.status(409); throw new Error("Stock changed while placing order. Please retry."); }
  }

  const order = await Order.create({
    user: req.user._id, items: orderItems, shippingAddress, phone,
    subtotal, total: subtotal, paymentMethod: "cod"
  });
  cart.items = [];
  await cart.save();
  res.status(201).json({ success: true, order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const allOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const allowed = ["processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(req.body.status)) { res.status(400); throw new Error("Invalid order status."); }
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found."); }
  if (order.status === "cancelled" || order.status === "delivered") {
    res.status(400); throw new Error("This order can no longer be changed.");
  }
  if (req.body.status === "cancelled") {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
  }
  order.status = req.body.status;
  await order.save();
  res.json({ success: true, order });
});
