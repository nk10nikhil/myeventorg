import connectDB from "@/lib/db";
import SuperAdmin from "@/models/SuperAdmin";
import { hashPassword } from "@/lib/auth";

async function initializeSuperAdmin() {
  try {
    await connectDB();

    // Check if super admin already exists
    const existing = await SuperAdmin.findOne({
      email: process.env.SUPER_ADMIN_EMAIL || "superadmin@ticketing.com",
    });

    if (existing) {
      console.log("Super Admin already exists");
      return;
    }

    // Create super admin
    const hashedPassword = await hashPassword(
      process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123",
    );

    await SuperAdmin.create({
      email: process.env.SUPER_ADMIN_EMAIL || "superadmin@ticketing.com",
      password: hashedPassword,
      name: "Super Administrator",
    });

    console.log("Super Admin created successfully");
    console.log(
      "Email:",
      process.env.SUPER_ADMIN_EMAIL || "superadmin@ticketing.com",
    );
    console.log(
      "Password:",
      process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123",
    );
  } catch (error) {
    console.error("Failed to initialize Super Admin:", error);
  }
}

initializeSuperAdmin();
