import { User } from "@/back-end/models/User";
import { VisaStatusManagement } from "@/back-end/models/VisaStatusManagement";


// Normalize raw step status from DB
function normalizeStatus(status?: string): "pending" | "approved" | "rejected" | "not_uploaded" {
  if (!status || status === "not uploaded") return "not_uploaded";
  if (["pending", "approved", "rejected"].includes(status)) return status as any;
  return "not_uploaded";
}

// Helper to determine next step
function determineNextStep(steps: {
  optReceipt?: any;
  optEAD?: any;
  i983?: any;
  i20?: any;
}): string {
  const s = {
    optReceipt: normalizeStatus(steps.optReceipt?.status),
    optEAD: normalizeStatus(steps.optEAD?.status),
    i983: normalizeStatus(steps.i983?.status),
    i20: normalizeStatus(steps.i20?.status),
  };

  if (s.optReceipt === "not_uploaded" || s.optReceipt === "rejected") return "Wait to submit OPT Receipt";
  if (s.optReceipt === "pending") return "OPT Receipt needs review";

  if (s.optEAD === "not_uploaded" || s.optEAD === "rejected") return "Wait to submit OPT EAD";
  if (s.optEAD === "pending") return "OPT EAD needs review";

  if (s.i983 === "not_uploaded" || s.i983 === "rejected") return "Wait to submit I-983";
  if (s.i983 === "pending") return "I-983 needs review";

  if (s.i20 === "not_uploaded" || s.i20 === "rejected") return "Wait to submit I-20";
  if (s.i20 === "pending") return "I-20 needs review";

  return "Complete";
}

function determineCurrentStepKey(steps: any): "optReceipt" | "optEAD" | "i983" | "i20" | null {
  const s = {
    optReceipt: normalizeStatus(steps.optReceipt?.status),
    optEAD: normalizeStatus(steps.optEAD?.status),
    i983: normalizeStatus(steps.i983?.status),
    i20: normalizeStatus(steps.i20?.status),
  };

  if (s.optReceipt === "not_uploaded" || s.optReceipt === "rejected" || s.optReceipt === "pending") return "optReceipt";
  if (s.optEAD === "not_uploaded" || s.optEAD === "rejected" || s.optEAD === "pending") return "optEAD";
  if (s.i983 === "not_uploaded" || s.i983 === "rejected" || s.i983 === "pending") return "i983";
  if (s.i20 === "not_uploaded" || s.i20 === "rejected" || s.i20 === "pending") return "i20";
  return null;
}


export const visaResolvers = {
  Query: {
    getVisaStatusManagementByUserId: async (_: any, { userId }: { userId: string }) => {
      return await VisaStatusManagement.findOne({ user: userId });
    },

    getAllVisaStatuses: async () => {
      return await VisaStatusManagement.find({})
        .populate("user", "realName email employment username")
        .lean();
    },

    getInProgressVisaEmployees: async () => {
      const visaRecords = await VisaStatusManagement.find({})
        .populate("user", "realName email employment username");

      const inProgress = visaRecords.filter((record) => {
        const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
        return steps.some((step) => {
          const status = normalizeStatus(step?.status);
          return status === "pending" || status === "rejected" || status === "not_uploaded";
        });
      });

      return inProgress
        .filter((record) => record.user)
        .map((record) => {
          const { user, optReceipt, optEAD, i983, i20, _id } = record;
          const populatedUser = user as typeof user & {
            _id: string;
            realName: string;
            email: string;
            username: string;
            employment: {
              visaTitle: string;
              startDate: string;
              endDate: string;
              daysRemaining: number;
            };
          };

          const visaSteps = {
            optReceipt: {
              status: normalizeStatus(optReceipt?.status),
              feedback: optReceipt?.feedback || null,
              document: optReceipt?.document || null,
            },
            optEAD: {
              status: normalizeStatus(optEAD?.status),
              feedback: optEAD?.feedback || null,
              document: optEAD?.document || null,
            },
            i983: {
              status: normalizeStatus(i983?.status),
              feedback: i983?.feedback || null,
              document: i983?.document || null,
            },
            i20: {
              status: normalizeStatus(i20?.status),
              feedback: i20?.feedback || null,
              document: i20?.document || null,
            },
          };


          return {
            _id,
            userId: populatedUser._id,
            realName: populatedUser.realName,
            email: populatedUser.email,
            username: populatedUser.username,
            employment: populatedUser.employment,
            visaSteps,
            currentStep: determineCurrentStepKey(visaSteps),
            nextStep: determineNextStep(visaSteps),
          };
        });
    },

    getCompletedVisaEmployees: async () => {
      const visaRecords = await VisaStatusManagement.find({})
        .populate("user", "realName email employment username")
        .lean();

      const completed = visaRecords.filter((record) => {
        const steps = [record.optReceipt, record.optEAD, record.i983, record.i20];
        return steps.every((step) => normalizeStatus(step?.status) === "approved");
      });

      return completed.map((record) => {
        const { user, optReceipt, optEAD, i983, i20, _id } = record;
        const populatedUser = user as any;

        const visaSteps = {
          optReceipt: {
            status: normalizeStatus(optReceipt?.status),
            feedback: optReceipt?.feedback || null,
            document: optReceipt?.document || null,
          },
          optEAD: {
            status: normalizeStatus(optEAD?.status),
            feedback: optEAD?.feedback || null,
            document: optEAD?.document || null,
          },
          i983: {
            status: normalizeStatus(i983?.status),
            feedback: i983?.feedback || null,
            document: i983?.document || null,
          },
          i20: {
            status: normalizeStatus(i20?.status),
            feedback: i20?.feedback || null,
            document: i20?.document || null,
          },
        };


        return {
          _id,
          userId: populatedUser._id,
          realName: populatedUser.realName,
          email: populatedUser.email,
          username: populatedUser.username,
          employment: populatedUser.employment,
          visaSteps,
          nextStep: "Complete",
        };
      });
    },
  },
};