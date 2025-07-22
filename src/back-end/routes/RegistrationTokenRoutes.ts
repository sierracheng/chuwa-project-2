import express, { Router } from "express";
import { createRegistrationToken } from "../controllers/RegistrationToken";

const router: Router = express.Router();

router.post("/registration-token", (req, res) => {
  createRegistrationToken(req, res);
});

export default router;
