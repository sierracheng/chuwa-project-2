// routes/email.ts
import express from "express";
import { sendEmail } from "../sendGrid/SendEmail";

const router = express.Router();

router.post("/email/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({
      to,
      subject,
      text,
      html,
    });

    return res.status(200).json({ success: true, message: "Email sent" });
  } catch (err) {
    console.error("Failed to send email:", err);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

export default router;
