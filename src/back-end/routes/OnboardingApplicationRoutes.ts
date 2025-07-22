import express, { Router } from "express";
import {
  createOnboardingApplication,
  updateOnboardingApplication,
  getOnboardingApplication,
  deleteOnboardingApplication,
} from "../controllers/OnboardingApplicationControllers";

const router: Router = express.Router();

// TODO:
// 1. POST: Create a new onboarding application
router.post("/onboarding-applications", (req, res) => {
  createOnboardingApplication(req, res);
});

// 2. PUT: Update an existing onboarding application
router.put("/onboarding-applications/:id", (req, res) => {
  updateOnboardingApplication(req, res);
});

// 3. GET: Get an existing onboarding application
router.get("/onboarding-applications/:id", (req, res) => {
  getOnboardingApplication(req, res);
});

// 4. DELETE: Delete an existing onboarding application
router.delete("/onboarding-applications/:id", (req, res) => {
  deleteOnboardingApplication(req, res);
});

export default router;
