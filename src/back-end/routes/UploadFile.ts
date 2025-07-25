import express from "express";
import imagekit from "../utils/imagekit";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { file, fileName } = req.body;

  if (!file || !fileName) {
    return res.status(400).json({ error: "Missing file or fileName" });
  }

  try {
    const response = await imagekit.upload({
      file, // base64 string
      fileName,
      tags: ["user-upload"],
    });
    res.json({ url: response.url });
  } catch (err) {
    console.error("ImageKit Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
