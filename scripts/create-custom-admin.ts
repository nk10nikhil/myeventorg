import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import AdminModel from "../models/Admin"

// MongoDB URI from env.txt
const MONGODB_URI = "mongodb+srv://nk10nikhil:nk10nikhil@cluster0.smlxpqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function createCustomAdmin() {
    try {
        console.log("Connecting to MongoDB...")
        await mongoose.connect(MONGODB_URI)
        console.log("Connected to MongoDB successfully")

        const email = "nk10nikhil@gmail.com"

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ email })

        if (existingAdmin) {
            console.log(`Admin with email ${email} already exists`)
            return
        }

        // Create admin user with custom credentials
        const hashedPassword = await bcrypt.hash("nk10nikhil", 10)

        await AdminModel.create({
            name: "Custom Admin",
            email,
            passwordHash: hashedPassword,
            role: "admin",
            createdAt: new Date(),
        })

        console.log("Custom admin user created successfully")
        console.log("Email: nk10nikhil@gmail.com")
        console.log("Password: nk10nikhil")
    } catch (error) {
        console.error("Error creating custom admin:", error)
    } finally {
        await mongoose.disconnect()
        console.log("Disconnected from MongoDB")
        process.exit(0)
    }
}

createCustomAdmin()