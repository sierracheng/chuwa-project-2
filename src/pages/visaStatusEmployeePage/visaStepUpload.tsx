import React, {useState} from 'react';
import { uploadVisaStepsAPI } from '@/back-end/api/visaStepsAPI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface VisaStepUploadProps {
    userId: string;
    step: 'optReceipt' | 'optEAD' | 'i983' | 'i20';
    onUploadSuccess?: (res:any) => void;
    onUploadError?: (error:string) => void;
}

export const VisaStepUpload: React.FC<VisaStepUploadProps> = (
    {
        userId,
        step,
        onUploadSuccess,
        onUploadError
    }
) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');

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

    return (
        <div className='space-y-4 p-4 border rounded-md shadow-sm bg-white'>
            <h3 className='text-lg font-medium'>{`Upload ${step} Document`}</h3>
            <div className='space-y-2'>
                <Input
                    type="file"
                    id={`file-${step}`}
                    onChange={handleFileSelect}
                    accept=".pdf"
                    disabled={uploading}
                />

                {selectedFile && (
                    <div className='text-sm text-gray-500 mt-2'>
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} MB)
                    </div>
                )}
            </div>
            <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className='w-full'
            >
                {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>

            {uploadStatus && (
                <div className='mt-2 text-sm text-gray-700'>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
};