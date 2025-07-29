import express, { Router } from "express";
import {
  createEmployee,
  createRegistrationToken,
  getAllEmployees,
  getToken,
} from "../controllers/RegistrationToken";

const router: Router = express.Router();

/**
 * Create a new registration token
 */
router.post("/registration-token", (req, res) => {
  createRegistrationToken(req, res);
});

/**
 * Create a new employee
 */
router.post("/registration-token/create-employee", (req, res) => {
  createEmployee(req, res);
});

/**
 * Get all employees from the database
 */
router.get("/registration-token/employees", (req, res) => {
  getAllEmployees(req, res);
});

/**
 * Get the token from the database
 */
router.get("/registration-token/token", (req, res) => {
  getToken(req, res);
});

export default router;
