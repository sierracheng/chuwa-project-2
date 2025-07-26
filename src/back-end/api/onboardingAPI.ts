import axios from "axios";

import type {
  IPersonName,
  IDocumentInfo,
  IAddress,
  IContactInfo,
  IEmployment,
  IEmergencyContact,
  IReference,
  GenderType,
} from "../models/Types";

/**
 * Create a new onboarding application
 */
export async function createOnboardingApplicationAPI(input: {
  userId: string;
  ssn: string;
  dateOfBirth: Date;
  gender: GenderType;
  realName: IPersonName;
  documents: IDocumentInfo;
  address: IAddress;
  contactInfo: IContactInfo;
  employment: IEmployment;
  emergencyContact: IEmergencyContact;
  reference: IReference;
}) {
  const {
    userId,
    ssn,
    dateOfBirth,
    gender,
    realName,
    documents,
    address,
    contactInfo,
    employment,
    emergencyContact,
    reference,
  } = input;
  try {
    const response = await axios.post(
      "http://localhost:3004/onboarding-applications",
      {
        userId,
        ssn,
        dateOfBirth,
        gender,
        realName,
        documents,
        address,
        contactInfo,
        employment,
        emergencyContact,
        reference,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating onboarding application:", error);
    throw error;
  }
}

/**
 * Only update the status of the onboarding application
 */
export async function updateOnboardingStatusAPI(
  userId: string,
  status: string
) {
  try {
    const response = await axios.put(
      `http://localhost:3004/onboarding-applications/${userId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    throw error;
  }
}

/**
 * Only update the feedback of the onboarding application
 */
export async function updateOnboardingFeedbackAPI(
  userId: string,
  feedback: string
) {
  try {
    const response = await axios.put(
      `http://localhost:3004/onboarding-applications/${userId}`,
      { feedback }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating onboarding feedback:", error);
    throw error;
  }
}

/**
 * Update all the onboarding application data
 */
export async function updateAllOnboardingApplicationAPI(input: {
  userId: string;
  ssn: string;
  dateOfBirth: Date;
  gender: GenderType;
  realName: IPersonName;
  documents: IDocumentInfo;
  address: IAddress;
  contactInfo: IContactInfo;
  employment: IEmployment;
  emergencyContact: IEmergencyContact;
  reference: IReference;
  status: string;
  feedback: string;
}) {
  const {
    userId,
    ssn,
    dateOfBirth,
    gender,
    realName,
    documents,
    address,
    contactInfo,
    employment,
    emergencyContact,
    reference,
    status,
    feedback,
  } = input;
  try {
    const response = await axios.put(
      "http://localhost:3004/onboarding-applications",
      {
        userId,
        ssn,
        dateOfBirth,
        gender,
        realName,
        documents,
        address,
        contactInfo,
        employment,
        emergencyContact,
        reference,
        status,
        feedback,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating onboarding application:", error);
    throw error;
  }
}

/**
 * Get the onboarding application data by user id
 */
export async function getOnboardingApplicationAPI(userId: string) {
  try {
    const response = await axios.get(
      `http://localhost:3004/onboarding-applications/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting onboarding application:", error);
    throw error;
  }
}

/**
 * Get the onboarding status by user id
 */
export async function getOnboardingStatusAPI(userId: string) {
  try {
    const response = await axios.get(
      `http://localhost:3004/onboarding-applications/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    throw error;
  }
}
