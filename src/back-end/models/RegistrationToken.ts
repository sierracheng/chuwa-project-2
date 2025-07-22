import mongoose, { Types } from "mongoose";

export interface IRegistrationToken {
  _id: Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
}

export const RegistrationTokenSchema = new mongoose.Schema<IRegistrationToken>(
  {
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const RegistrationToken = mongoose.model<IRegistrationToken>(
  "RegistrationToken",
  RegistrationTokenSchema
);
