/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/back-end/models/User";
import { VisaStatusManagement } from "@/back-end/models/VisaStatusManagement";

// Helper function to determine next step in visa process
function determineNextStep(steps: {
  optReceipt?: any;
  optEAD?: any;
  i983?: any;
  i20?: any;
}) {
  if (!steps.optReceipt || steps.optReceipt.status === "rejected") {
    return "Submit OPT Receipt";
  }
  if (steps.optReceipt.status === "pending") {
    return "Wait for HR to approve OPT Receipt";
  }
  if (!steps.optEAD || steps.optEAD.status === "rejected") {
    return "Submit OPT EAD";
  }
  if (steps.optEAD.status === "pending") {
    return "Wait for HR to approve OPT EAD";
  }
  if (!steps.i983 || steps.i983.status === "rejected") {
    return "Submit I-983";
  }
  if (steps.i983.status === "pending") {
    return "Wait for HR to approve I-983";
  }
  if (!steps.i20 || steps.i20.status === "rejected") {
    return "Submit I-20";
  }
  if (steps.i20.status === "pending") {
    return "Wait for HR to approve I-20";
  }
  return "Complete";
}

export const visaResolvers = {
  Query: {
    getVisaStatusManagementByUserId: async (
      _: any,
      { userId }: { userId: string }
    ) => {
      return await VisaStatusManagement.findOne({ user: userId });
    },

    getAllVisaStatuses: async () => {
      return await VisaStatusManagement.find({})
        .populate("user", "realName email workAuth username")
        .lean()
    },

    getInProgressVisaEmployees: async () => {
      const visaRecords = await VisaStatusManagement.find({})
        .populate("user", "realName email workAuth username")

      const inProgress = visaRecords.filter((record) => {
        const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
        return steps.some(
          (step) => !step || step.status === "pending" || step.status === "rejected"
        );
      });

      return inProgress.map((record) => {
        const { user, optReceipt, optEAD, i983, i20, _id } = record;
        const nextStep = determineNextStep({ optReceipt, optEAD, i983, i20 });
        const populatedUser = user as typeof user & {
          _id: string;
          realName: string;
          email: string;
          username: string;
          workAuth: string;
        };

        return {
          _id,
          userId: populatedUser._id,
          realName: populatedUser.realName,
          email: populatedUser.email,
          username: populatedUser.username,
          workAuth: populatedUser.workAuth,
          visaSteps: { optReceipt, optEAD, i983, i20 },
          nextStep,
        };
      });
    },

    getCompletedVisaEmployees: async () => {
      const visaRecords = await VisaStatusManagement.find({})
        .populate("user", "realName email workAuth username")
        .lean();

      const completed = visaRecords.filter((record) => {
        const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
        return steps.every((step) => step && step.status === "approved");
      });

      return completed.map((record) => {
        const { user, optReceipt, optEAD, i983, i20, _id } = record;
        const populatedUser = user as any; // Type assertion for populated user

        return {
          _id,
          userId: populatedUser._id,
          realName: populatedUser.realName,
          email: populatedUser.email,
          username: populatedUser.username,
          workAuth: populatedUser.workAuth,
          visaSteps: { optReceipt, optEAD, i983, i20 },
          nextStep: "Complete",
        };
      });
    },

    getVisaEmployeesByStatus: async (
      _: any,
      { status }: { status: "pending" | "approved" | "rejected" | "in-progress" | "complete" }
    ) => {
      const visaRecords = await VisaStatusManagement.find({})
        .populate("user", "realName email workAuth username")
        .lean();

      let filteredRecords;

      if (status === "in-progress") {
        filteredRecords = visaRecords.filter((record) => {
          const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
          return steps.some(
            (step) => !step || step.status === "pending" || step.status === "rejected"
          );
        });
      } else if (status === "complete") {
        filteredRecords = visaRecords.filter((record) => {
          const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
          return steps.every((step) => step && step.status === "approved");
        });
      } else {
        filteredRecords = visaRecords.filter((record) => {
          const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
          return steps.some((step) => step && step.status === status);
        });
      }

      return filteredRecords.map((record) => {
        const { user, optReceipt, optEAD, i983, i20, _id } = record;
        const nextStep = determineNextStep({ optReceipt, optEAD, i983, i20 });
        const populatedUser = user as any; // Type assertion for populated user

        return {
          _id,
          userId: populatedUser._id,
          realName: populatedUser.realName,
          email: populatedUser.email,
          username: populatedUser.username,
          workAuth: populatedUser.workAuth,
          visaSteps: { optReceipt, optEAD, i983, i20 },
          nextStep,
        };
      });
    },
  },

  Mutation: {
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

      const record = new VisaStatusManagement({ user: user._id });
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

    bulkUpdateVisaStatus: async (
      _: any,
      {
        updates,
      }: {
        updates: Array<{
          userId: string;
          stepName: "optReceipt" | "optEAD" | "i983" | "i20";
          status: "pending" | "approved" | "rejected";
          feedback?: string;
        }>;
      }
    ) => {
      const results = [];
      
      for (const update of updates) {
        try {
          const visaStatus = await VisaStatusManagement.findOne({ 
            user: update.userId 
          });
          
          if (!visaStatus) {
            throw new Error(`Visa status record not found for user ${update.userId}`);
          }

          visaStatus[update.stepName] = {
            ...visaStatus[update.stepName],
            status: update.status,
            feedback: update.feedback ?? visaStatus[update.stepName]?.feedback ?? "",
          };

          await visaStatus.save();
          results.push({ success: true, userId: update.userId, visaStatus });
        } catch (error) {
          results.push({ 
            success: false, 
            userId: update.userId, 
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      return results;
    },

    deleteVisaStatusManagement: async (
      _: any,
      { userId }: { userId: string }
    ) => {
      const visaStatus = await VisaStatusManagement.findOne({ user: userId });
      if (!visaStatus) {
        throw new Error("Visa status management record not found");
      }

      await VisaStatusManagement.deleteOne({ user: userId });
      return visaStatus;
    },
  },
};