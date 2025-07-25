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
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload visa steps');
        }

        return await response.json();
        
    } catch (error) {
        console.error("Error uploading visa steps:", error);
        throw error; // Re-throw the original error instead of generic message
    }
}

export async function getVisaStatusAPI(userId: string): Promise<any> {
    try {
        const response = await fetch(`http://localhost:3004/visa/${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch visa status');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching visa status:", error);
        throw error; // Re-throw the original error instead of generic message
    }
}