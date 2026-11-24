import dotenv from "dotenv";
import dns from "dns";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`ShopSphere API running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
