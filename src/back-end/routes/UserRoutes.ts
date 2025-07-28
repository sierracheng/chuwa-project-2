import express, { Router } from "express";
import {
  getUserVisaTypeById,
  getUserData,
  getUserNameAndAvatarById,
  getEmployeesData,
} from "../controllers/UserControllers";

const router: Router = express.Router();

// GET: Get user visa type by ID
router.get("/:id/visa-type", (req, res) => {
  getUserVisaTypeById(req, res);
});

router.get("/getUserData/:id", getUserData);

router.get("/getUserNameAndAvatar/:id", getUserNameAndAvatarById);

router.get("/getEmployees", getEmployeesData);

export default router;

