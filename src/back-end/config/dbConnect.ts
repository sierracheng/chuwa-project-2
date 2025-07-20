import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

// Base case:
if (!MONGODB_URI) {
  throw new Error("MongoDB URI is not defined in environment configs.");
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Failed to connect MongoDB", error);
    process.exit(1);
  }
}

export default connectDB;
