import React, { useEffect, useState } from "react"
import { VisaStepUpload } from "./visaStepUpload"
import { useSelector } from "react-redux";
import { selectId } from "@/redux/features/authenticate/authenticateSlice";
import { getUploadPermissionsAPI } from "@/back-end/api/visaStepsAPI";
import { Link } from "react-router-dom";
import { findUserVisaTypeAPI } from "@/back-end/api/userAPI";

export function VisaStatusEmployeePage() {
    const [visaType, setVisaType] = useState<string | null>(null);
    const userId = useSelector(selectId);
    // console.log(`VisaStatusEmployeePage - userId: ${userId}`);
    const [uploadPermissions, setUploadPermissions] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        if (userId) {
            findUserVisaTypeAPI({ id: userId }).then((response) => {
                if (response.success) {
                    setVisaType(response.data.visaType);
                } else {
                    console.error("Failed to fetch visa type:", response.message);
                    setVisaType(null);
                }
            }).catch((error) => {
                console.error("Error fetching visa type:", error);
                setVisaType(null);
            });
        }
    }, [userId]);

    useEffect(() => {
        // console.log('Component mounted, userId:', userId);
        loadUploadPermissions();
    }, []); 

    useEffect(() => {
        if (userId) {
            // console.log(`Fetching upload permissions for userId: ${userId}`);
            loadUploadPermissions();
        }
    }, [userId]);

    const loadUploadPermissions = async () => {
        try {
            setLoading(true);
            const permissions = await getUploadPermissionsAPI(userId);
            setUploadPermissions(permissions);
            console.log("Upload permissions:", permissions);
        } catch (error) {
            console.error("Error loading upload permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = async (res: any) => {
        console.log("Upload successful!", res);
        alert(`Upload successful! Document URL: ${res.url}`);
        await loadUploadPermissions(); // Reload permissions after successful upload
    };

    const handleUploadError = (error: string) => {
        console.error("Upload failed:", error);
        alert(`Upload failed: ${error}`);
    };

    if (visaType !== 'F1'){
        return (
            <div className="container mx-auto p-4 space-y-6">
                <h1 className="text-2xl font-bold text-left">Visa Management</h1>
                <h2 className="text-red-500">You are not eligible to upload documents for this visa type.</h2>
            </div>
        )
    }

    if (!userId) {
        return (
            <div>
                <div className="text-red-500">User ID not found. Please log in.</div>
                <Link to="/login" className="text-blue-500 underline">Go to Login</Link>
            </div>
        );
    }

    if (loading) {
        return <div className="text-gray-500">Loading upload permissions...</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h2 className="text-[40px] font-bold text-left">Visa Status Management</h2>
            <p className="text-gray-600 text-left">
                Please upload the required documents for your visa status.
                <br />
                If you have any questions, please contact your HR representative.
            </p>
            <VisaStepUpload
                userId={userId}
                step="optReceipt"
                title="Step 1: Upload OPT Receipt"
                permission={uploadPermissions?.optReceipt}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
            <VisaStepUpload
                userId={userId}
                step="optEAD"
                title="Step 2: Upload OPT EAD"
                permission={uploadPermissions?.optEAD}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
            <VisaStepUpload
                userId={userId}
                step="i983"
                title="Step 3: Upload I-983"
                permission={uploadPermissions?.i983}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
            <VisaStepUpload
                userId={userId}
                step="i20"
                title="Step 4: Upload I-20"
                permission={uploadPermissions?.i20}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
            />
        </div>
    )
}