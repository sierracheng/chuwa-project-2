import mongoose, { Document, Schema, Types } from "mongoose";
import {
  type IDocumentInfo,
  type IReference,
} from "./Types";
import {
  DocumentSchema,
  ReferenceSchema,
} from "./Subschema";

export interface IOnboardingApplication extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // ref to User
  status: "pending" | "approved" | "rejected";
  documents: IDocumentInfo;
  reference: IReference;
  feedback: string; // This uses for storing feedback from HR
}

export const OnboardingApplicationSchema = new Schema<IOnboardingApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },
    documents: { type: DocumentSchema, required: true },
    reference: { type: ReferenceSchema, required: true },
    feedback: { type: String },
  },
  { timestamps: true }
);

export const OnboardingApplication = mongoose.model<IOnboardingApplication>(
  "OnboardingApplication",
  OnboardingApplicationSchema
);
