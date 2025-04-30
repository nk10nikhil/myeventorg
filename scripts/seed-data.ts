import bcrypt from "bcryptjs"
import connectDB from "../lib/db"
import AdminModel from "../models/Admin"
import Registration from "../models/Registration"
import { generateQRCode } from "../utils/qrcode"

async function seedData() {
  try {
    await connectDB()

    // Create admin user if it doesn't exist
    const existingAdmin = await AdminModel.findOne({ email: "admin@techfest.com" })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10)

      await AdminModel.create({
        name: "Admin User",
        email: "admin@techfest.com",
        passwordHash: hashedPassword,
        role: "admin",
        createdAt: new Date(),
      })

      console.log("Admin user created successfully")
    }

    // Create sample registrations
    const sampleRegistrations = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
        orderId: "order_" + Math.random().toString(36).substring(2, 15),
        amount: 99900,
        paymentVerified: true,
        qrUsed: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "9876543211",
        orderId: "order_" + Math.random().toString(36).substring(2, 15),
        amount: 99900,
        paymentVerified: true,
        qrUsed: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "9876543212",
        orderId: "order_" + Math.random().toString(36).substring(2, 15),
        amount: 99900,
        paymentVerified: false,
        qrUsed: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        name: "Alice Brown",
        email: "alice.brown@example.com",
        phone: "9876543213",
        orderId: "order_" + Math.random().toString(36).substring(2, 15),
        amount: 99900,
        paymentVerified: true,
        qrUsed: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        phone: "9876543214",
        orderId: "order_" + Math.random().toString(36).substring(2, 15),
        amount: 99900,
        paymentVerified: true,
        qrUsed: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ]

    // Check if we already have sample data
    const existingRegistrations = await Registration.countDocuments()

    if (existingRegistrations < 5) {
      for (const regData of sampleRegistrations) {
        const registration = new Registration(regData)

        if (registration.paymentVerified) {
          // Generate QR code
          const qrData = JSON.stringify({
            regId: registration._id.toString(),
            event: "techfest2025",
          })

          const qrCode = await generateQRCode(qrData)
          registration.qrCode = qrCode
        }

        await registration.save()
      }

      console.log("Sample registrations created successfully")
    } else {
      console.log("Sample data already exists")
    }

    console.log("Seed completed successfully")
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    process.exit(0)
  }
}

seedData()
