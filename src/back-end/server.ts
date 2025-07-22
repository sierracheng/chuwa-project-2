import express from "express";
import connectDB from "./config/dbConnect";
import cors from "cors";
import OnboardingApplicationRoutes from "./routes/OnboardingApplicationRoutes";
import UserRoutes from "./routes/UserRoutes";
import VisaStatusManagementRoutes from "./routes/VisaStatusManagementRoutes";
import RegistrationTokenRoutes from "./routes/RegistrationTokenRoutes";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3004;

// Add Middleware
app.use(express.json());

// Add routes
app.use("/", UserRoutes);
app.use("/", OnboardingApplicationRoutes);
app.use("/", VisaStatusManagementRoutes);
app.use("/", RegistrationTokenRoutes);

// Connect to server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
