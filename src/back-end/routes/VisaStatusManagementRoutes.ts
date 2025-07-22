import express, { Router } from "express";
import {
  createVisaStatusManagement,
  updateVisaStatusManagement,
  getVisaStatusManagement,
  deleteVisaStatusManagement,
} from "../controllers/VisaStatusManagementControllers";

const router: Router = express.Router();

// TODO:
// 1. POST: Create a new visa status management
router.post("/visa-status-management", (req, res) => {
  createVisaStatusManagement(req, res);
});

// 2. PUT: Update an existing visa status management
router.put("/visa-status-management/:id", (req, res) => {
  updateVisaStatusManagement(req, res);
});

// 3. GET: Get an existing visa status management
router.get("/visa-status-management/:id", (req, res) => {
  getVisaStatusManagement(req, res);
});

// 4. DELETE: Delete an existing visa status management
router.delete("/visa-status-management/:id", (req, res) => {
  deleteVisaStatusManagement(req, res);
});

export default router;
