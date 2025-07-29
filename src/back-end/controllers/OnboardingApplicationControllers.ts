import { type Request, type Response } from "express";
import { OnboardingApplication } from "../models/OnboardingApplication";
import { User } from "../models/User";
import { VisaStatusManagement } from "../models/VisaStatusManagement";
import mongoose from "mongoose";

/**
 * HTTP Status Code:
 * 200 OK
 * 201 Created
 * 202 Accepted
 * 400 Bad request
 * 404 Not found
 * 500 Internal Server Error
 */

/**
 * DONE:
 * Create a new onboarding application
 * 1. When user first time login to the system, he needs to create his information
 * 2. Get user id from request so that we can match the user id with the onboarding application
 * 3. Front-end will send the onboarding application data to the back-end:
 *    - Personal Information(FirstName, LastName...)
 *    - Profile Picture
 *    - Address(Street, Building, City, State, Zip)
 *    - Contact Information(Phone, Email)
 *    - Emergency Contact(FirstName, LastName, MiddleName, Phone, Email, Relationship)
 *    - Documents(Driver's License, Work Authorization)
 *    - Reference(FirstName, LastName, MiddleName, Phone, Email, Relationship)
 * 4. Back-end will create a new onboarding application with the user id and the onboarding application data
 * 5. Back-end will return the onboarding application id, and user to the front-end
 */
export async function createOnboardingApplication(req: Request, res: Response) {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Destructure onboarding fields from the body
    const {
      realName,
      ssn,
      dateOfBirth,
      gender,
      address,
      contactInfo,
      employment,
      emergencyContact,
      documents,
      reference,
    } = req.body;

    const onboardingApplication = await OnboardingApplication.create({
      userId,
      status: "pending",
      documents,
      reference,
      feedback: "",
    });

    const user = await User.findByIdAndUpdate(userId, {
      realName,
      ssn,
      dateOfBirth,
      gender,
      address,
      contactInfo,
      employment,
      emergencyContact,
      onboardingApplication: onboardingApplication._id,
    });

    if (req.body.documents?.workAuthorizationUrl) {
      const existingVisa = await VisaStatusManagement.findOne({
        user: req.body.userId,
      });
      if (!existingVisa) {
        await VisaStatusManagement.create({
          user: req.body.userId,
          optReceipt: {
            status: "pending",
            document: {
              url: req.body.documents.workAuthorizationUrl,
              uploadedAt: new Date(),
            },
          },
          optEAD: { status: "not uploaded" },
          i983: { status: "not uploaded" },
          i20: { status: "not uploaded" },
        });
      }
    }

    return res.status(201).json({
      message: "Onboarding application created successfully",
      onboardingApplicationId: onboardingApplication._id,
      user,
    });
  } catch (error) {
    console.error("Error creating onboarding application:", error);
    return res
      .status(500)
      .json({ error: "Failed to create onboarding application" });
  }
}

/**
 * TODO:
 * Update the onboarding application
 * 1. Rewrite all the onboarding application data
 * 2. Front-end will send the onboarding application data to the back-end:
 *    - Personal Information(FirstName, LastName...)
 *    - Profile Picture
 *    - Address(Street, Building, City, State, Zip)
 *    - Contact Information(Phone, Email)
 *    - Emergency Contact(FirstName, LastName, MiddleName, Phone, Email, Relationship)
 *    - Documents(Driver's License, Work Authorization)
 *    - Reference(FirstName, LastName, MiddleName, Phone, Email, Relationship)
 * 3. Back-end will update the onboarding application with the new data
 * 4. Back-end will return the onboarding application id, and user to the front-end
 */
export async function updateOnboardingApplication(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    // Destructure onboarding fields from the body
    const {
      realName,
      ssn,
      dateOfBirth,
      gender,
      address,
      contactInfo,
      employment,
      emergencyContact,
      documents,
      reference,
      status,
      feedback,
    } = req.body;

    const onboardingApplication = await OnboardingApplication.findOneAndUpdate(
      { userId },
      {
        status,
        documents,
        reference,
        feedback,
      }
    );

    const user = await User.findByIdAndUpdate(userId, {
      realName,
      ssn,
      dateOfBirth,
      gender,
      address,
      contactInfo,
      employment,
      emergencyContact,
      onboardingApplication: onboardingApplication?._id,
    });
    if (req.body.documents?.workAuthorizationUrl) {
      let existingVisa = await VisaStatusManagement.findOne({
        user: req.body.userId,
      });
      if (!existingVisa) {
        existingVisa = await VisaStatusManagement.create({
          user: req.body.userId,
          optReceipt: {
            status: "pending",
            document: {
              url: req.body.documents.workAuthorizationUrl || "",
              uploadedAt: new Date(),
            },
          },
          optEAD: { status: "not uploaded" },
          i983: { status: "not uploaded" },
          i20: { status: "not uploaded" },
        });
      } else {
        if (existingVisa.optReceipt) {
          existingVisa.optReceipt.document = {
            url: req.body.documents.workAuthorizationUrl,
            uploadedAt: new Date(),
          };
          existingVisa.optReceipt.status = "pending";
        }
      }
      await existingVisa.save();
    }

    return res.status(200).json({
      message: "Onboarding application updated successfully",
      onboardingApplication,
      user,
    });
  } catch (error) {
    console.error("Error updating onboarding application:", error);
    return res
      .status(500)
      .json({ error: "Failed to update onboarding application" });
  }
}

/**
 * TODO:
 * Get the onboarding application data by user id
 */
export async function getOnboardingApplication(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const onboardingApplication = await OnboardingApplication.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!onboardingApplication) {
      return res
        .status(404)
        .json({ error: "Onboarding application not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return the onboarding application data and the user data
    return res.status(200).json({ onboardingApplication, user });
  } catch (error) {
    console.error("Error getting onboarding application:", error);
    return res
      .status(500)
      .json({ error: "Failed to get onboarding application" });
  }
}
