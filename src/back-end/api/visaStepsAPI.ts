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

        console.log('Response status:', response.status);

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
        
        if (!visaStatus.success) {
            // If no visa status exists, only optReceipt is allowed
            return {
                optReceipt: { canUpload: true, reason: "" },
                optEAD: { canUpload: false, reason: "Complete OPT Receipt first" },
                i983: { canUpload: false, reason: "Complete OPT Receipt first" },
                i20: { canUpload: false, reason: "Complete OPT Receipt first" }
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
    
    // Check if previous step is required and not approved
    if (previousStep && previousStep.status !== "approved") {
        return { 
            canUpload: false, 
            reason: "Previous step must be approved first",
            status: currentStep.status 
        };
    }
    
    // Check current step status
    switch (currentStep.status) {
        case "pending":
            return { 
                canUpload: false, 
                reason: "Document is pending HR review",
                status: "pending"
            };
        case "approved":
            return { 
                canUpload: false, 
                reason: "Document already approved",
                status: "approved"
            };
        case "rejected":
            return { 
                canUpload: true, 
                reason: "Previous submission was rejected. You can re-upload.",
                status: "rejected",
                feedback: currentStep.feedback || "No feedback provided"
            };
        default: // not_submitted
            return { 
                canUpload: true, 
                reason: "",
                status: "not_submitted"
            };
    }
}

export async function getVisaStatusAPI(userId: string): Promise<any> {
    try {
        console.log('Fetching visa status for userId:', userId);
        const response = await fetch(`http://localhost:3004/visa/${userId}`, {
            method: 'GET',
        });

        console.log('getVisaStatusAPI response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch visa status');
        }

        const result = await response.json();
        console.log('getVisaStatusAPI success:', result);
        return result;
        
    } catch (error) {
        console.error("Error fetching visa status:", error);
        throw error; // Re-throw the original error instead of generic message
    }
}
