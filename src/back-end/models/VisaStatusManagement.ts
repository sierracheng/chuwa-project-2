import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVisaStatusManagement extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // ref to User
  optReceipt?: {
    status: "pending" | "approved" | "rejected";
    feedback?: string;
    document?: {
      url: string;
      uploadedAt: Date;
    };
  };
  optEAD?: {
    status: "pending" | "approved" | "rejected";
    feedback?: string;
    document?: {
      url: string;
      uploadedAt: Date;
    };
  };
  i983?: {
    status: "pending" | "approved" | "rejected";
    feedback?: string;
    document?: {
      url: string;
      uploadedAt: Date;
    };
  };
  i20?: {
    status: "pending" | "approved" | "rejected";
    feedback?: string;
    document?: {
      url: string;
      uploadedAt: Date;
    };
  };
}

export const VisaStatusManagementSchema = new Schema<IVisaStatusManagement>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    optReceipt: {
      status: { type: String, enum: ["pending", "approved", "rejected"] },
      feedback: String,
      document: {
        url: String,
        uploadedAt: Date,
      },
    },
    optEAD: {
      status: { type: String, enum: ["pending", "approved", "rejected"] },
      feedback: String,
      document: {
        url: String,
        uploadedAt: Date,
      },
    },
    i983: {
      status: { type: String, enum: ["pending", "approved", "rejected"] },
      feedback: String,
      document: {
        url: String,
        uploadedAt: Date,
      },
    },
    i20: {
      status: { type: String, enum: ["pending", "approved", "rejected"] },
      feedback: String,
      document: {
        url: String,
        uploadedAt: Date,
      },
    },
  },
  { timestamps: true }
);

export const VisaStatusManagement = mongoose.model<IVisaStatusManagement>(
  "VisaStatusManagement",
  VisaStatusManagementSchema
);
