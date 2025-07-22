import mongoose, { Document, Schema, Types } from "mongoose";
import { VisaStepSchema } from "./Subschema";
import type { IVisaStep } from "./Types";

export interface IVisaStatusManagement extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // ref to User
  optReceipt?: IVisaStep;
  optEAD?: IVisaStep;
  i983?: IVisaStep;
  i20?: IVisaStep;
}

export const VisaStatusManagementSchema = new Schema<IVisaStatusManagement>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    optReceipt: VisaStepSchema,
    optEAD: VisaStepSchema,
    i983: VisaStepSchema,
    i20: VisaStepSchema,
  },
  { timestamps: true }
);

export const VisaStatusManagement = mongoose.model<IVisaStatusManagement>(
  "VisaStatusManagement",
  VisaStatusManagementSchema
);
