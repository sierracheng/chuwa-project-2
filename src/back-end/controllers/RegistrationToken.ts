import { type Request, type Response } from "express";
import { reportError, validateEmailRequest } from "../utils/utils";
import { Employee, RegistrationToken } from "../models/RegistrationToken";
import { sendEmail } from "../sendGrid/SendEmail";
import crypto from "crypto";
import { User } from "../models/User";

/**
 * Get all employees from the database
 * This is only for HR to get all employees from the database
 * This is used to send the registration token to the employee
 */
export async function getAllEmployees(req: Request, res: Response) {
  try {
    const employees = await Employee.find();
    return res.status(200).json({ employees });
  } catch (error) {
    return reportError(res, error, "getAllEmployees");
  }
}

/**
 * Add a new employee to the database
 * This is only for HR to add a new employee to the database
 * After add the potential employee, HR will send the registration token to the employee
 */
export async function createEmployee(req: Request, res: Response) {
  try {
    const { firstName, lastName, email } = req.body;
    // Check if the email is valid
    if (!validateEmailRequest(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    // Check if the user already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists, cannot invite user to sign-up again.",
      });
    }
    // Create a new user
    const newUser = await Employee.create({
      firstName,
      lastName,
      email,
    });
    return res.status(200).json({
      message: "Added employee successfully",
      employee: newUser,
    });
  } catch (error) {
    return reportError(res, error, "createEmployee");
  }
}

/**
 * TODO:
 * Implement the logic to create a registration token
 * 1. Generate a random token
 * 2. The token should be valid for 3 hours
 * 3. The token should be unique
 * 4. The token should be saved to the database
 * 5. The token should be sent to the user's email
 * 6. The token should be used to create a new user
 * 7. After 3 hours, delete the token from the database
 */
export async function createRegistrationToken(req: Request, res: Response) {
  try {
    const { from, email } = req.body;
    console.log("Received request to create registration token:", {
      from,
      email,
    });
    // Validate email format
    if (!validateEmailRequest(email)) {
      return res.status(400).json({ message: "Email query is not valid" });
    }

    // Check if the User already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists, cannot invite user to sign-up again.",
      });
    }
    // Randomly generate a token
    let token: string;
    let exists = true;
    // The token should be unique
    do {
      token = crypto.randomBytes(32).toString("hex");
      exists = (await RegistrationToken.exists({ token })) !== null;
    } while (exists);
    console.log("Generated unique token:", token);
    // The token should be valid for 3 hours
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
    // Save the token to the database
    const newToken = await RegistrationToken.create({
      token,
      email,
      expiresAt,
    });
    // Save the token to the employee
    await Employee.updateOne({ email }, { token: newToken._id });
    console.log("Saved registration token to DB");
    // signup url: http://localhost:xxxx/signup?email=xxx&token=xx
    const signupUrl = `${process.env.SIGN_UP_URL}?email=${encodeURIComponent(
      email
    )}&token=${token}`;
    console.log("Signup URL:", signupUrl);
    // Send the token to the user's email
    try {
      await sendEmail({
        to: email,
        from: from || process.env.DEFAULT_FROM_EMAIL!, // Whoever clicked the send email button, will be the sender
        subject: "Chuwa - Please Sign-up Your Account",
        text: `Please click the link below to sign up your account: ${signupUrl}`,
        html: `<p>Please click the link below to sign up your account: <a href="${signupUrl}">${signupUrl}</a></p>`,
      });
      // Return the token, createdAt, and expiresAt
      return res.status(200).json({
        token,
        createdAt: newToken.createdAt,
        expiresAt: newToken.expiresAt,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    }

    // Return the token
    return res.status(200).json({ token });
  } catch (error) {
    return reportError(res, error, "createRegistrationToken");
  }
}

//Validate the registration token
export async function validateRegistrationToken(req: Request, res: Response) {
  try {
    const { token } = req.body;
    console.log("Received request to validate registration token:", token);
    // Check if the token exists in the database
    const registrationToken = await RegistrationToken.findOne({ token });
    if (!registrationToken) {
      return res.status(400).json({ message: "Invalid registration token" });
    }
    // Check if the token is expired
    if (registrationToken.expiresAt < new Date()) {
      return res.status(400).json({ message: "Registration token expired" });
    }
    // Return true if the token is valid
    console.log("Registration token is valid");
    return res.status(200).json({
      valid: true,
      email: registrationToken.email,
    });
  } catch (error) {
    return reportError(res, error, "validateRegistrationToken");
  }
}

/**
 * Get the token from the database
 * This is used to get the token from the database
 */
export async function getToken(req: Request, res: Response) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const token = await RegistrationToken.findOne({ email });
    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }
    return res.status(200).json({
      token,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
    });
  } catch (error) {
    return reportError(res, error, "getToken");
  }
}
