import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publicUser = (user) => ({
  id: user._id, name: user.name, email: user.email, role: user.role,
  phone: user.phone, address: user.address
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error("Name, email and password are required.");
  }
  if (password.length < 8) {
    res.status(400); throw new Error("Password must contain at least 8 characters.");
  }
  const normalizedEmail = email.toLowerCase().trim();
  if (await User.findOne({ email: normalizedEmail })) {
    res.status(409); throw new Error("An account with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: normalizedEmail, password: hashedPassword });
  res.status(201).json({ success: true, token: createToken(user._id), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error("Email and password are required."); }
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401); throw new Error("Invalid email or password.");
  }
  res.json({ success: true, token: createToken(user._id), user: publicUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (address !== undefined) req.user.address = address;
  await req.user.save();
  res.json({ success: true, user: publicUser(req.user) });
});
