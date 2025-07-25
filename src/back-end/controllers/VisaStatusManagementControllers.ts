import { type Request, type Response } from "express";
import { VisaStatusManagement } from "../models/VisaStatusManagement";
import imagekit from "../utils/imagekit";

/**
 * TODO:
 * getVisa
 */
export async function getVisaStatus(req: Request, res: Response) {
 try {
    const userId = req.params.id;
    const visa = await VisaStatusManagement.findOne({ user: userId });
    if (!visa) {
      return res.status(404).json({ message: "Visa status not found" });
    }
    return res.status(200).json(visa);
  } catch (error) {
    console.error("Error fetching visa status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function uploadVisaSteps (req: Request, res: Response) {
    const { userId, step } = req.params;
    console.log("Received request to upload visa step:", { userId, step });
    const file = req.file;

    type VisaSteps = "optReceipt" | "optEAD" | "i983" | "i20";

    if (!["optReceipt", "optEAD", "i983", "i20"].includes(step))
    return res.status(400).json({ message: "Invalid step" });

    if (!file || !file.buffer) {
        return res.status(400).json({ message: "No file uploaded" });
    }

  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer, 
      fileName: `${userId}-${step}.pdf`, 
      folder: "/visa-documents",
    });

    const visa = await VisaStatusManagement.findOne({ user: userId });
    if (!visa) {
      return res.status(404).json({ message: "Visa status not found" });
    }
    
    visa[step as VisaSteps] = {
        status: "pending",
        document: {
          url: uploadResponse.url || "",
          uploadedAt: new Date(),   
        },
    }
    await visa.save();
    console.log(`Uploaded ${step} document for user ${userId}:`, uploadResponse.url);
    res.status(200).json({
      message: `${step} document uploaded successfully`,
      url: uploadResponse.url,
    });
  } catch (error) {
    console.error("Error uploading visa step:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function approveAction(req: Request, res: Response) {
}

export async function rejectAction(req: Request, res: Response) {
}