import express from "express";
import { RegistrationToken } from "../models/RegistrationToken";

const router = express.Router();

router.post("/validate-token", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valid: false, message: "Token missing" });
    }

    const tokenDoc = await RegistrationToken.findOne({ token });

    if (!tokenDoc) {
        return res.status(404).json({ valid: false, message: "Token not found" });
    }

    if (tokenDoc.expiresAt < new Date()) {
        return res.status(400).json({ valid: false, message: "Token expired" });
    }

    return res.json({ valid: true });
});

export default router;
