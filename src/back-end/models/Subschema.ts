import { Schema } from "mongoose";

/**
 * Sub-Schema for Person's Name
 */
export const PersonNameSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    preferredName: { type: String },
  },
  { _id: false }
);

/**
 * Sub-Schema for Person's Contact Information
 */
export const ContactInfoSchema = new Schema(
  {
    cellPhone: { type: String, required: true },
    workPhone: { type: String },
    email: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Sub-Schema for Emergency Contact
 */
export const EmergencyContactSchema = new Schema(
  {
    realName: PersonNameSchema,
    contactInfo: ContactInfoSchema,
    relationship: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Sub-Schema for Necessary documents
 */
export const DocumentSchema = new Schema(
  {
    profilePictureUrl: { type: String },
    driverLicenseUrl: { type: String },
    workAuthorizationUrl: { type: String },
  },
  { _id: false }
);

/**
 * Sub-Schema for who recommended you to this company
 */
export const ReferenceSchema = new Schema(
  {
    realName: PersonNameSchema,
    contactInfo: ContactInfoSchema,
  },
  { _id: false }
);

export const VisaStepSchema = new Schema({
  status: { type: String, enum: ["pending", "approved", "rejected"], required: true },
  feedback: String,
  document: {
    url: String,
    uploadedAt: Date,
  },
}, { _id: false });
