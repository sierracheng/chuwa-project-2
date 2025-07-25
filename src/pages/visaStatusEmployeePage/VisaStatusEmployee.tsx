import React from "react"
import { VisaStepUpload } from "./visaStepUpload"
import { useSelector } from "react-redux";
import { selectId } from "@/redux/features/authenticate/authenticateSlice";


export function VisaStatusEmployeePage() {
    const userId = useSelector(selectId);
    console.log("User ID from Redux:", userId);
    console.log("User ID type:", typeof userId);

    const handleUploadSuccess = (res: any) => {
        console.log("Upload successful!", res);
        alert(`Upload successful! Document URL: ${res.url}`);
    };

    const handleUploadError = (error: string) => {
        console.error("Upload failed:", error);
        alert(`Upload failed: ${error}`);
    };
    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-[40px] font-bold text-left">Visa Status Management</h2>
            <VisaStepUpload
                userId={userId}
                step="optReceipt"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
            <VisaStepUpload
                userId={userId}
                step="optEAD"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
            <VisaStepUpload
                userId={userId}
                step="i983"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
            <VisaStepUpload
                userId={userId}
                step="i20"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
        </div>
    )
}