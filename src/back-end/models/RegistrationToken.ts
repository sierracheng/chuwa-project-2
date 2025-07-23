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
    // The token will be deleted after 3 hours
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Automatically delete the token when the token is expired
RegistrationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RegistrationToken = mongoose.model<IRegistrationToken>(
  "RegistrationToken",
  RegistrationTokenSchema
);
