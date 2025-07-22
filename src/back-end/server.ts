// TODO: Connect server to mongodb
// Add routes

import express from "express";
import connectDB from "./config/dbConnect";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

// Add Middleware
app.use(express.json());

// Add routes

// Connect to server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
