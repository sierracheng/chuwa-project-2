import express, { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  getVisaStatus,
  uploadVisaSteps,
} from "../controllers/VisaStatusManagementControllers";

const router: Router = express.Router();

router.post("/visa-status/:id", (req, res) => getVisaStatus(req, res));

router.post("/visa/upload/:userId/:step",
  upload.single("pdf"),
  uploadVisaSteps
);

export default router;
