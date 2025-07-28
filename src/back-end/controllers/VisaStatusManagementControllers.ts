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
    // console.log("Received request to get visa status for user:", userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const visa = await VisaStatusManagement.findOne({ user: userId });
    if (!visa) {
      return res.status(404).json({ message: "Visa status not found" });
    }
    // console.log("Visa status found:", visa);

    return res.status(200).json({
        success: true,
        visa
    });
  } catch (error) {
    console.error("Error fetching visa status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

type VisaSteps = "optReceipt" | "optEAD" | "i983" | "i20";

export async function uploadVisaSteps (req: Request, res: Response) {
    const { userId, step } = req.params;
    console.log("Received request to upload visa step:", { userId, step });
    const file = req.file;

    const validSteps: VisaSteps[] = ["optReceipt", "optEAD", "i983", "i20"];

    if (!validSteps.includes(step as VisaSteps)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid step" 
    });
    }

    if (!file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    let visa = await VisaStatusManagement.findOne({ user: userId });
    if (!visa) {
      if (step !== "optReceipt") {
        return res.status(400).json({ 
            success: false,
            message: "you must upload the OPT receipt first" 
        });
      } 
      visa = new VisaStatusManagement({
        user: userId,
        optReceipt: {
            status: "pending",
        },
        optEAD: {
            status: "not uploaded",
        },
        i983: {
            status: "not uploaded",
        },
        i20: {
            status: "not uploaded",
        },
      });
    } else {
        const uploadCheck = checkUploadConditions(visa, step as VisaSteps);
        if (!uploadCheck.allowed) {
            return res.status(400).json({ 
                success: false,
                message: `${uploadCheck.message}` 
            });
        }
    }
    try {
    const uploadResponse = await imagekit.upload({
      file: file!.buffer, 
      fileName: `${userId}-${step}.pdf`, 
      folder: "/visa-documents",
    });
    // At this point, visa is guaranteed to be non-null

    visa![step as VisaSteps] = {
        status: "pending",
        document: {
          url: uploadResponse.url || "",
          uploadedAt: new Date(),   
        },
    };
    await visa!.save();
    // In your uploadVisaSteps function, after saving:
    console.log(`Uploaded ${step} document for user ${userId}:`, uploadResponse.url);
    res.status(200).json({
        success: true,
        message: `${step} document uploaded successfully`,
        url: uploadResponse.url,
        step,
        userId,
        status: 'pending',
    });
  } catch (error) {
    console.error("Error uploading visa step:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Helper function to check if user can upload a specific step
function checkUploadConditions(visa: any, step: VisaSteps): { allowed: boolean; message: string } {
    const stepOrder: VisaSteps[] = ["optReceipt", "optEAD", "i983", "i20"];
    const currentStepIndex = stepOrder.indexOf(step);

    // Check if it's the first step (optReceipt)
    if (step === "optReceipt") {
        const currentStatus = visa.optReceipt.status;
        if (currentStatus === "pending") {
            return { allowed: false, message: "OPT Receipt is already pending HR review. Please wait for approval." };
        }
        if (currentStatus === "approved") {
            return { allowed: false, message: "OPT Receipt is already approved. Cannot re-upload." };
        }
        // Allow upload if rejected or not_submitted
        return { allowed: true, message: "" };
    }

    // For subsequent steps, check if previous step is approved
    const previousStep = stepOrder[currentStepIndex - 1];
    const previousStepStatus = visa[previousStep].status;

    if (previousStepStatus !== "approved") {
        return { 
            allowed: false, 
            message: `Cannot upload ${step}. Previous step (${previousStep}) must be approved first.` 
        };
    }

    // Check current step status
    const currentStatus = visa[step].status;
    if (currentStatus === "pending") {
        return { allowed: false, message: `${step} is already pending HR review. Please wait for approval.` };
    }
    if (currentStatus === "approved") {
        return { allowed: false, message: `${step} is already approved. Cannot re-upload.` };
    }

    // Allow upload if rejected or not_submitted and previous step is approved
    return { allowed: true, message: "" };
}

export async function updateReviewVisaStep(req: Request, res: Response) {
    const { userId, step } = req.params;
    const { status, feedback } = req.body;
    const validSteps: VisaSteps[] = ["optReceipt", "optEAD", "i983", "i20"];

    if( !validSteps.includes(step as VisaSteps)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid step" 
        });
    }

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid status" 
        });
    }

    try {
        const record = await VisaStatusManagement.findOne({ user: userId });
        if (!record) {
            return res.status(404).json({ 
                success: false,
                message: "Visa status record not found" 
            });
        }
        const currentStep = record[step as VisaSteps] || {status: 'pending'};
        currentStep.status = status;
        if (status === "rejected") {
            currentStep.feedback = feedback || "No feedback provided";
        }
        record[step as VisaSteps] = currentStep;
        await record.save();
        return res.status(200).json({ 
            success: true,
            updated: record,
            message: "Visa status updated successfully" 
        });
    } catch (error) {
        console.error("Error updating visa step:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};
