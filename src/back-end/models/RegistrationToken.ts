import mongoose, { Schema, Types } from "mongoose";

export interface IEmployee {
  firstName: string;
  lastName: string;
  email: string;
  token: Types.ObjectId;
  status: "Pending" | "Submitted";
  link: string;
}

export interface IRegistrationToken {
  _id: Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  status: "Pending" | "Submitted";
  link: string;
}

export const RegistrationTokenSchema = new mongoose.Schema<IRegistrationToken>(
  {
    token: { type: String },
    email: { type: String, required: true },
    // The token will be deleted after 3 hours
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 60 * 60 * 1000),
    },
    status: { type: String, default: "Pending" },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

export const EmployeeSchema = new mongoose.Schema<IEmployee>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  token: { type: Schema.Types.ObjectId, ref: "RegistrationToken" },
  status: { type: String, default: "Pending" },
  link: { type: String, default: "" },
});

// Automatically delete the token when the token is expired
RegistrationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RegistrationToken = mongoose.model<IRegistrationToken>(
  "RegistrationToken",
  RegistrationTokenSchema
);
export const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);
