export const Gender = {
  Male: "Male",
  Female: "Female",
  Other: "Other",
} as const;

export const Visa = {
  Citizen: "Citizen",
  GreenCard: "Green Card",
  International: "International",
  H1B: "H1B",
  L2: "L2",
  F1: "F1 (CPT, OPT)",
  H4: "H4",
  Other: "Other",
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];
export type VisaTypeUnion = (typeof Visa)[keyof typeof Visa];

export interface IPersonName {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
}

export interface IContactInfo {
  cellPhone: string;
  workPhone?: string;
  email: string;
}

export interface IEmployment {
  visaTitle: VisaTypeUnion;
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
}

export interface IEmergencyContact {
  realName: IPersonName;
  contactInfo: IContactInfo;
  relationship: string;
}

export interface IDocumentInfo {
  profilePictureUrl?: string;
  driverLicenseUrl?: string;
  workAuthorizationUrl?: string;
}

export interface IReference {
  realName: IPersonName;
  contactInfo: IContactInfo;
}

export interface IVisaStep {
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  document?: {
    url: string;
    uploadedAt: Date;
  };
}