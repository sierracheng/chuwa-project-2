import { EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/util";
import { type Response } from "express";

/**
 * Public function
 * Call and reuse this function while try-catch the error
 * Report error msg on server console
 * @param res
 * @param error
 * @param context Additional context you want to report
 */
export function reportError(res: Response, error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  return res.status(500).json({ message: "Internal server error." });
}

/**
 * Validate request.body's email is valid or not
 * @param email
 * @returns True if email is valid
 */
export function validateEmailRequest(email: string): boolean {
  return email.length > 0 && EMAIL_REGEX.test(email);
}
/**
 * Validate request.body's password is valid or not
 * @param password
 * @returns True if password if valid
 */
export function validatePasswordStrength(password: string): boolean {
  return password.length > 0 && PASSWORD_REGEX.test(password);
}
