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
