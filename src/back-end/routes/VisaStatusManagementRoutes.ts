import express, { Router } from "express";
import { upload } from "../middlewares/multer";
import {
  getVisaStatus,
  uploadVisaSteps,
  updateReviewVisaStep,
} from "../controllers/VisaStatusManagementControllers";

const router: Router = express.Router();

router.get("/visa/:id", getVisaStatus);

router.post("/visa/:userId/:step/upload",
  upload.single("document"),
  uploadVisaSteps
);

router.patch("/visa/:userId/:step/review", updateReviewVisaStep);



export default router;
