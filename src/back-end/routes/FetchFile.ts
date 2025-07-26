import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/fetch", async (req, res) => {
  const rawUrl = req.query.url;

  if (!rawUrl || typeof rawUrl !== "string") {
    return res.status(400).json({ error: "Missing or invalid URL" });
  }
  console.log("RAW URL:", rawUrl);

  const decodedUrl = decodeURIComponent(rawUrl);

  try {
    const response = await axios.get(decodedUrl, {
      responseType: "arraybuffer",
    });
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.setHeader("Content-Disposition", 'inline; filename="fetched-file"');
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching from ImageKit:", error);
    res.status(500).json({ error: "Failed to fetch file from ImageKit" });
  }
});

export default router;
