import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized. Please log in.");
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      res.status(401);
      throw new Error("User account not found.");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error(error.name === "TokenExpiredError" ? "Session expired. Please log in again." : "Invalid authentication token.");
  }
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403);
  next(new Error("Admin access required."));
};
