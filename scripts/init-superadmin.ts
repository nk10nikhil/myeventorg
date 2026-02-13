import { resolve } from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: resolve(__dirname, "../.env") });

import connectDB from "../lib/db";
import SuperAdmin from "../models/SuperAdmin";
import { hashPassword } from "../lib/auth";

async function initializeSuperAdmin() {
  try {
    await connectDB();

    // Check if super admin already exists
    const existing = await SuperAdmin.findOne({
      email: process.env.SUPER_ADMIN_EMAIL || "nk10nikhil@gmail.com",
    });

    if (existing) {
      console.log("Super Admin already exists");
      return;
    }

    // Create super admin
    const hashedPassword = await hashPassword(
      process.env.SUPER_ADMIN_PASSWORD || "nk10nikhil",
    );

    await SuperAdmin.create({
      email: process.env.SUPER_ADMIN_EMAIL || "nk10nikhil@gmail.com",
      password: hashedPassword,
      name: "Super Administrator",
    });

    console.log("Super Admin created successfully");
    console.log(
      "Email:",
      process.env.SUPER_ADMIN_EMAIL || "nk10nikhil@gmail.com",
    );
    console.log("Password:", process.env.SUPER_ADMIN_PASSWORD || "nk10nikhil");
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize Super Admin:", error);
    process.exit(1);
  }
}

initializeSuperAdmin();
