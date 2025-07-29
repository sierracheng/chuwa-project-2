import {
    GET_VISA_STATUS_BY_USER_ID,
    GET_ALL_VISA_STATUSES,
    GET_IN_PROGRESS_VISA_EMPLOYEES,
    GET_ALL_VISA_EMPLOYEES,
} from '../mutations/Visa';


// Employee side API
export async function uploadVisaStepsAPI(
    userId: string,
    step: string,
    file: File,
): Promise<any> {
    try {
        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size,
        })
        // Add frontend validation to match multer
        if (file.type !== "application/pdf") {
            throw new Error("Only PDF files are allowed");
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error("File size must be less than 5MB");
        }

        const formData = new FormData();
        formData.append('document', file, file.name);

        const response = await fetch(`http://localhost:3004/visa/${userId}/${step}/upload`, {
            method: 'POST',
            body: formData,
        });

        // console.log('Response:', response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload visa steps');
        }
        const uploadResponse = await response.json();
        console.log('Upload successful:', uploadResponse);

        return uploadResponse;
    } catch (error) {
        console.error("Error uploading visa steps:", error);
        throw error; // Re-throw the original error instead of generic message
    }
}
// Add function to get upload permissions for UI
export async function getUploadPermissionsAPI(userId: string): Promise<any> {
    try {
        const visaStatus = await getVisaStatusAPI(userId);
        console.log('Visa status from API:', visaStatus);

        if (!visaStatus.success) {
            // If no visa status exists, only optReceipt is allowed
            return {
                optReceipt: { canUpload: true, reason: "", status: "not uploaded" },
                optEAD: { canUpload: false, reason: "Complete OPT Receipt first", status: "not uploaded" },
                i983: { canUpload: false, reason: "Complete OPT Receipt first", status: "not uploaded" },
                i20: { canUpload: false, reason: "Complete OPT Receipt first", status: "not uploaded" }
            };
        }

        const visa = visaStatus.visa;
        const permissions = {
            optReceipt: getStepPermission(visa, "optReceipt"),
            optEAD: getStepPermission(visa, "optEAD", visa.optReceipt),
            i983: getStepPermission(visa, "i983", visa.optEAD),
            i20: getStepPermission(visa, "i20", visa.i983)
        };

        return permissions;
    } catch (error) {
        console.error("Error getting upload permissions:", error);
        throw error;
    }
}

function getStepPermission(visa: any, step: string, previousStep?: any) {
    const currentStep = visa[step];
    const prevApproved = previousStep?.status === 'approved';

    if (!currentStep) {
        const canStart = step === "optReceipt" || prevApproved;
        let uiMessage = '';
        if (step === "optReceipt") {
            uiMessage = "Please upload a copy of your OPT Receipt.";
        } else if (!prevApproved) {
            uiMessage = `Complete the previous step before uploading ${step}.`;
        } else if (step === "optEAD") {
            uiMessage = "Please upload a copy of your OPT EAD.";
        } else if (step === "i983") {
            uiMessage = "Please upload the filled I-983 form.";
        } else if (step === "i20") {
            uiMessage = "Please upload your updated I-20 from your school.";
        }

        return {
            canUpload: canStart,
            reason: canStart ? "Ready to upload" : "Previous step must be approved first",
            status: "not uploaded",
            url: null,
            uiMessage,
        };
    }

    // if previous step not approved
    if (previousStep && previousStep.status !== "approved") {
        return {
            canUpload: false,
            reason: "Previous step must be approved first",
            status: currentStep.status || "not uploaded",
            url: currentStep.document?.url || null,
            uiMessage: `Complete the previous step before uploading ${step}.`
        };
    }

    // Based on current status
    switch (currentStep.status) {
        case "pending":
            return {
                canUpload: false,
                reason: "Waiting for HR review",
                status: "pending",
                url: currentStep.document?.url || null,
                uiMessage: `Waiting for HR to approve your ${step.toUpperCase()}`
            };
        case "approved":
            let nextStepMessage = "";
            if (step === "optReceipt") nextStepMessage = "Please upload a copy of your OPT EAD.";
            if (step === "optEAD") nextStepMessage = "Please download and fill out the I-983 form.";
            if (step === "i983") nextStepMessage = "Please upload your new I-20 from your school.";
            if (step === "i20") nextStepMessage = "All documents have been approved.";

            return {
                canUpload: false,
                reason: "Document already approved",
                status: "approved",
                url: currentStep.document?.url || null,
                uiMessage: nextStepMessage
            };
        case "rejected":
            return {
                canUpload: true,
                reason: "Previous submission was rejected. You can re-upload.",
                status: "rejected",
                feedback: currentStep.feedback || "No feedback provided",
                url: currentStep.document?.url || null,
                uiMessage: `Your ${step.toUpperCase()} was rejected. Please re-upload.`
            };
        default:
            return {
                canUpload: step === "optReceipt" || prevApproved,
                reason: "Upload allowed",
                status: currentStep.status,
                url: currentStep.document?.url || null,
                uiMessage: "Upload your document"
            };
    }
}



export async function getVisaStatusAPI(userId: string): Promise<any> {
    try {
        // console.log('Fetching visa status for userId:', userId);
        const response = await fetch(`http://localhost:3004/visa/${userId}`, {
            method: 'GET',
        });

        // console.log('getVisaStatusAPI response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch visa status');
        }

        const result = await response.json();
        console.log('getVisaStatusAPI success:', result);
        return {
            success: true,
            visa: result.visa,
        };

    } catch (error) {
        console.error("Error fetching visa status:", error);
        throw error; // Re-throw the original error instead of generic message
    }
}

//HR side API
//REST API to update

export async function updateReviewVisaStepAPI(
    userId: string,
    step: string,
    action: "approved" | "rejected",
    feedback?: string
){
    const response = await fetch(`http://localhost:3004/visa/${userId}/${step}/review`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            status: action,
            feedback: feedback || "",
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update visa step');
    }

    const result = await response.json();
    return {
        success: true,
        updated: result.updated,
    };
}

//GraphQL API to query
export async function getVisaStatusByUserIdAPI(userId: string) {
    const response = await fetch("http://localhost:3004/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_VISA_STATUS_BY_USER_ID,
            variables: { userId },
        }),
    });

    const data = await response.json();
    if (data.errors) {
        console.error("GraphQL error:", data.errors);
        return { success: false };
    }

    return {
        success: true,
        visa: data.data.getVisaStatusManagementByUserId,
    };
}

export async function getInProgressVisaEmployeesAPI() {
    const response = await fetch("http://localhost:3004/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_IN_PROGRESS_VISA_EMPLOYEES,
        }),
    });

    const data = await response.json();
    if (data.errors) {
        console.error("GraphQL error:", data.errors);
        return { success: false };
    }

    return {
        success: true,
        employees: data.data.getInProgressVisaEmployees,
    };
}

export async function getAllVisaEmployeesAPI() {
    const response = await fetch("http://localhost:3004/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_ALL_VISA_EMPLOYEES,
        }),
    });

    const data = await response.json();
    if (data.errors) {
        console.error("GraphQL error:", data.errors);
        return { success: false };
    }

    return {
        success: true,
        employees: data.data.getAllVisaEmployees,
    };
}



export async function getAllVisaStatusesAPI() {
    const response = await fetch("http://localhost:3004/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: GET_ALL_VISA_STATUSES,
        }),
    });

    const result = await response.json();
    if (result.errors) {
        console.error("GraphQL error:", result.errors);
        return { success: false };
    }

    return {
        success: true,
        visaStatuses: result.data.getAllVisaStatuses,
    };
}