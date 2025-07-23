/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../models/User";
import { OnboardingApplication } from "../models/OnboardingApplication";
import { VisaStatusManagement } from "../models/VisaStatusManagement";
import { RegistrationToken } from "../models/RegistrationToken";

export const resolvers = {
  // Reading data
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      return await User.findById(user._id)
        .populate("onboardingApplication")
        .populate("visaStatusManagement");
    },
    getAllUsers: async () => {
      return await User.find()
        .populate("onboardingApplication")
        .populate("visaStatusManagement");
    },
    getUserById: async (_: any, { id }: { id: string }) => {
      return await User.findById(id)
        .populate("onboardingApplication")
        .populate("visaStatusManagement");
    },
    getOnboardingApplicationByUserId: async (
      _: any,
      { userId }: { userId: string }
    ) => {
      return await OnboardingApplication.findOne({ user: userId });
    },
    getVisaStatusManagementByUserId: async (
      _: any,
      { userId }: { userId: string }
    ) => {
      return await VisaStatusManagement.findOne({ user: userId });
    },
  },
  // Writing data
  Mutation: {
    createSimpleUser: async (_: any, { input }: { input: any }) => {
      const tokenDoc = await RegistrationToken.findOne({ token: input.token });
      if (!tokenDoc) {
        throw new Error("Invalid or missing registration token");
      }

      if (tokenDoc.expiresAt < new Date()) {
        throw new Error("Registration token has expired");
      }

      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const newUser = new User({
        username: input.username,
        password: input.password, // hash if needed
        email: input.email,
        role: "Employee",
      });

      await newUser.save();
      await RegistrationToken.deleteOne({ _id: tokenDoc._id });

      return newUser;
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }

      Object.assign(user, input);
      await user.save();
      return user;
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      const user = await User.findById(id);
      if (!user) {
        throw new Error("User not found");
      }

      await User.deleteOne({ _id: id });
      return user;
    },
    createOnboardingApplication: async (_: any, { data }: { data: any }) => {
      const user = await User.findById(data.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const onboardingApplication = new OnboardingApplication({
        user: user._id,
        ...data.input,
      });

      await onboardingApplication.save();
      return onboardingApplication;
    },

    updateOnboardingApplication: async (
      _: any,
      { id, data }: { id: string; data: any }
    ) => {
      const application = await OnboardingApplication.findById(id);
      if (!application) {
        throw new Error("Onboarding application not found");
      }

      Object.assign(application, data);
      await application.save();
      return application;
    },

    updateApplicationStatus: async (
      _: any,
      {
        id,
        status,
        feedback,
      }: {
        id: string;
        status: "pending" | "approved" | "rejected";
        feedback?: string;
      }
    ) => {
      const application = await OnboardingApplication.findById(id);
      if (!application) {
        throw new Error("Onboarding application not found");
      }

      application.status = status;
      application.feedback = feedback ?? "";
      await application.save();
      return application;
    },

    createVisaStatusManagement: async (
      _: any,
      { userId }: { userId: string }
    ) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const existingRecord = await VisaStatusManagement.findOne({
        user: userId,
      });
      if (existingRecord) {
        throw new Error(
          "Visa status management record already exists for this user"
        );
      }

      const record = new VisaStatusManagement(user._id);
      await record.save();
      return record;
    },

    updateVisaStatusStep: async (
      _: any,
      {
        userId,
        stepName,
        data,
      }: {
        userId: string;
        stepName: "optReceipt" | "optEAD" | "i983" | "i20";
        data: {
          status: "pending" | "approved" | "rejected";
          feedback?: string;
          document?: {
            url: string;
            uploadedAt: Date;
          };
        };
      }
    ) => {
      const visaStatus = await VisaStatusManagement.findOne({ user: userId });
      if (!visaStatus) {
        throw new Error("Visa status management record not found");
      }

      visaStatus[stepName] = {
        ...visaStatus[stepName],
        ...data,
        document: {
          url: data.document?.url ?? visaStatus[stepName]?.document?.url ?? "",
          uploadedAt:
            data.document?.uploadedAt ??
            visaStatus[stepName]?.document?.uploadedAt ??
            new Date(),
        },
      };

      await visaStatus.save();
      return visaStatus;
    },
  },
};
