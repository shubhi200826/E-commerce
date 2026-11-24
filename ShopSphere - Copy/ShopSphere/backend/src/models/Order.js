import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: { type: String, required: true },
  phone: { type: String, required: true },
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cod"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  status: { type: String, enum: ["placed", "processing", "shipped", "delivered", "cancelled"], default: "placed" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
