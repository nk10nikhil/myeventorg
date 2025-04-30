import bcrypt from "bcryptjs"
import connectDB from "../lib/db"
import AdminModel from "../models/Admin"

async function seedAdmin() {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email: "admin@techfest.com" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 10)

    await AdminModel.create({
      name: "Admin User",
      email: "admin@techfest.com",
      passwordHash: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    })

    console.log("Admin user created successfully")
    console.log("Email: admin@techfest.com")
    console.log("Password: Admin@123")
  } catch (error) {
    console.error("Error seeding admin:", error)
  } finally {
    process.exit(0)
  }
}

seedAdmin()
