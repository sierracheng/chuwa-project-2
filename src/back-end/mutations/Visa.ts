export const GET_VISA_STATUS_BY_USER_ID = `
  query GetVisaStatusManagementByUserId($userId: ID!) {
    getVisaStatusManagementByUserId(userId: $userId) {
      _id
      user
      optReceipt { status feedback document { url uploadedAt } }
      optEAD { status feedback document { url uploadedAt } }
      i983 { status feedback document { url uploadedAt } }
      i20 { status feedback document { url uploadedAt } }
    }
  }
`;

export const GET_ALL_VISA_STATUSES = `
  query GetAllVisaStatuses {
    getAllVisaStatuses {
      _id
      user
      optReceipt { status }
      optEAD { status }
      i983 { status }
      i20 { status }
    }
  }
`;

export const GET_IN_PROGRESS_VISA_EMPLOYEES = `
  query GetInProgressVisaEmployees {
    getInProgressVisaEmployees {
      _id
      userId
      realName { firstName lastName }
      email
      username
      employment {
        visaTitle
        startDate
        endDate
        daysRemaining
      }
      currentStep
      nextStep
      visaSteps {
        optReceipt { status feedback document { url uploadedAt } }
        optEAD { status feedback document { url uploadedAt } }
        i983 { status feedback document { url uploadedAt } }
        i20 { status feedback document { url uploadedAt } }
      }
    }
  }
`;

export const GET_COMPLETED_VISA_EMPLOYEES = `
  query GetCompletedVisaEmployees {
    getCompletedVisaEmployees {
      _id
      userId
      realName { firstName lastName }
      email
      username
      employment {
        visaTitle
        startDate
        endDate
        daysRemaining
    }
      nextStep
      visaSteps {
        optReceipt { status feedback document { url uploadedAt } }
        optEAD { status feedback document { url uploadedAt } }
        i983 { status feedback document { url uploadedAt } }
        i20 { status feedback document { url uploadedAt } }
      }
    }
  }
`;
