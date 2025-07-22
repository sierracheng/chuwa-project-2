import express from "express";
import connectDB from "./config/dbConnect";
import cors from "cors";
import OnboardingApplicationRoutes from "./routes/OnboardingApplicationRoutes";
import UserRoutes from "./routes/UserRoutes";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

// Add Middleware
app.use(express.json());

// Add routes
app.use("/", UserRoutes);
app.use("/", OnboardingApplicationRoutes);

// Connect to server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
