import { Schema } from "mongoose";

/**
 * Sub-Schema for Person's Name
 */
export const PersonNameSchema = new Schema(
  {
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    preferredName: { type: String },
  },
  { _id: false }
);

export const AddressSchema = new Schema(
  {
    street: { type: String },
    building: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  { _id: false }
);

/**
 * Sub-Schema for Person's Contact Information
 */
export const ContactInfoSchema = new Schema(
  {
    cellPhone: { type: String },
    workPhone: { type: String },
    email: { type: String },
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
    relationship: { type: String },
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

export const VisaStepSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "not uploaded"],
    },
    feedback: String,
    document: {
      url: String,
      uploadedAt: Date,
    },
  },
  { _id: false }
);
