import express, { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  getVisaStatus,
  uploadVisaSteps,
} from "../controllers/VisaStatusManagementControllers";

const router: Router = express.Router();

router.post("/visa/:id", (req, res) => getVisaStatus(req, res));

router.post("/visa/:userId/:step/upload",
  upload.single("document"),
  uploadVisaSteps
);

export default router;
