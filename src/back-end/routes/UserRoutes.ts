import express, { Router } from "express";
import {
  getUserVisaTypeById
} from "../controllers/UserControllers";

const router: Router = express.Router();

// GET: Get user visa type by ID
router.get("/:id/visa-type", (req, res) => {
  getUserVisaTypeById(req, res);
});

export default router;
