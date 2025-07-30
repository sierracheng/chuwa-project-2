import React, {useState} from 'react';
import { uploadVisaStepsAPI } from '@/back-end/api/visaStepsAPI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface VisaStepUploadProps {
    userId: string;
    step: 'optReceipt' | 'optEAD' | 'i983' | 'i20';
    title?: string;
    permission?: {
        canUpload: boolean;
        reason: string;
        status?: string;
        feedback?: string;
        uiMessage?: string;
    };
    onUploadSuccess?: (res:any) => void;
    onUploadError?: (error:string) => void;
}

export const VisaStepUpload: React.FC<VisaStepUploadProps> = (
    {
        userId,
        step,
        title,
        permission,
        onUploadSuccess,
        onUploadError
    }
) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const displayTitle = title || `Upload ${step} Document`;

    const canUpload = permission?.canUpload !== false;
    const isDisabled = !canUpload || uploading;


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadStatus('');
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setUploadStatus('Uploading...');

        try {
            const res = await uploadVisaStepsAPI(userId, step, selectedFile);

            setUploadStatus('Upload successful!' + (res.message ? `: ${res.message}` : ''));
            console.log('Upload response:', res);
            if (onUploadSuccess) {
                onUploadSuccess(res);
            }

            setSelectedFile(null);
            const fileInput = document.getElementById(`file-${step}`) as HTMLInputElement;
            if (fileInput) {
                fileInput.value = ''; // Clear the file input
            }
        } catch (error: any) {
            setUploading(false);
            setUploadStatus(`Upload failed: ${error.message}`);
            if (onUploadError) {
                onUploadError(error.message);
            }
        } finally {
            setUploading(false);
        }

    }

    // Helper function to get status color
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // Helper function to get status badge
    const getStatusBadge = (status?: string) => {
        if (!status || status === 'not uploaded') return null;
        // console.log(`getStatusBadge - status: ${status}`);
        
        const colorClass = getStatusColor(status);
        return (
            <span className={`inline-block px-2 py-1 text-xs rounded-full border ${colorClass} bg-opacity-10`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };
    console.log(`VisaStepUpload ${step} - permission:`, permission);
    // console.log(`VisaStepUpload ${step} - permission?.status:`, permission?.status);
    // console.log(`VisaStepUpload ${step} - will render badge:`, permission?.status && getStatusBadge(permission.status));

    // console.log('uploadStatus value:', uploadStatus);
    // console.log('uploadStatus includes failed:', uploadStatus.includes('failed'));

    // console.log(`VisaStepUpload ${step} - permission:`, permission);

    return (
        <div className={`space-y-4 p-4 border rounded-md shadow-sm ${canUpload ? 'bg-white' : 'bg-gray-50'}`}>
            {/* Header with title and status */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{displayTitle}</h3>
                {permission?.status && getStatusBadge(permission.status)}
            </div>

            {/* Permission status message */}
            {permission && !canUpload && (
                <div className="p-3 bg-gray-100 border-l-4 border-gray-400 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Upload not available:</strong> {permission.reason}
                    </p>
                </div>
            )}

            {/* Feedback message for rejected documents */}
            {permission?.status === 'rejected' && permission.feedback && (
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <p className="text-sm text-red-700">
                        <strong>HR Feedback:</strong> {permission.feedback}
                    </p>
                </div>
            )}

            {/* Approved status message */}
            {permission?.status === 'approved' && (
                <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-sm text-green-700">
                        <strong>Document approved!</strong> This step is complete.
                    </p>
                </div>
            )}
            {/* File upload section */}
            <div className="space-y-2">
                {/* Contextual Step Message */}
                {permission?.uiMessage && (
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm text-blue-800">{permission.uiMessage}</p>
                </div>
                )}

                {step === "i983" && (
                <div className="flex gap-4">
                    <a
                    href="/templates/I-983-Empty.pdf"
                    download
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                    Download I-983 Empty Template
                    </a>
                    <a
                    href="/templates/I-983-Sample.pdf"
                    download
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                    Download I-983 Sample Template
                    </a>
                </div>
                )}


                <Input
                    type="file"
                    id={`file-${step}`}
                    onChange={handleFileSelect}
                    accept=".pdf"
                    disabled={isDisabled}
                    className={!canUpload ? 'opacity-50 cursor-not-allowed' : ''}
                />

                {selectedFile && (
                    <div className="text-sm text-gray-500 mt-2">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </div>
                )}
            </div>

            {/* Upload button */}
            <Button
                onClick={handleUpload}
                disabled={!selectedFile || isDisabled}
                className="w-full"
                variant={canUpload ? "default" : "secondary"}
            >
                {uploading ? 'Uploading...' : canUpload ? 'Upload Document' : 'Upload Not Available'}
            </Button>


            {/* Status message */}
            {uploadStatus && (
                <div className={`mt-2 text-sm ${uploadStatus.includes('failed') ? 'text-red-600' : 'text-gray-700'}`}>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
};