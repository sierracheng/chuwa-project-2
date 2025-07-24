import { type Request, type Response } from "express";
import { OnboardingApplication } from "../models/OnboardingApplication";
import { User } from "../models/User";

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
 * TODO:
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
 */
export async function updateOnboardingApplication(
  req: Request,
  res: Response
) {}

/**
 * TODO:
 */
export async function getOnboardingApplication(req: Request, res: Response) {}

/**
 * TODO:
 */
export async function deleteOnboardingApplication(
  req: Request,
  res: Response
) {}
