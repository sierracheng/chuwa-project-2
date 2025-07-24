import express from "express";
import { validateRegistrationToken } from "../controllers/RegistrationToken";

const router = express.Router();

router.post("/validate-token", (req, res) => validateRegistrationToken(req, res));

export default router;
