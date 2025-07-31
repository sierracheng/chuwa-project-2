import React, { useEffect, useState } from 'react';
import type { IUser } from '../../back-end/models/User';
import Section from '../../components/ui/section';
import { getUserDataAPI } from '@/back-end/api/userAPI';
import { updateAllOnboardingApplicationAPI } from '@/back-end/api/onboardingAPI';
import { toast } from 'sonner';
import { uploadFile } from '@/back-end/api/uploadFile';
import { Visa } from '@/back-end/models/Types';


const visaOptions = Object.entries(Visa).map(([key, label]) => ({
    value: key,
    label: label === "F1_CPT_OPT" ? "F1" : label,
}));

export function PersonalInformationPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [formState, setFormState] = useState<Partial<IUser>>({});

    useEffect(() => {
        async function fetchUserData() {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const data = await getUserDataAPI(userId);
                setUserData(data);
                setFormState(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, []);

    const handleNestedChange = (section: string, key: string, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [key]: value,
            },
        }));
    };

    const handleDoubleNestedChange = (section: string, subsection: string, key: string, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [subsection]: {
                    ...(prev as any)[section]?.[subsection],
                    [key]: value,
                },
            },
        }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const uploadPromise = uploadFile(file)
        toast.promise(uploadPromise, {
            loading: 'Uploading...',
            success: (data) => {
                const url = data
                setFormState((prev) => ({
                    ...prev,
                    onboardingApplication: {
                        ...prev.onboardingApplication,
                        documents: {
                            ...prev.onboardingApplication?.documents,
                            profilePictureUrl: url,
                        },
                    },
                } as Partial<IUser>));
                return {
                    message: `Profile Picture Has Been Sucessfully Uploaded`,
                    description: '',
                };
            },
            error: 'Error',
        });


    };

    const handleDocumentUpload = (type: 'driverLicenseUrl' | 'workAuthorizationUrl') =>
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const uploadPromise = uploadFile(file)
            toast.promise(uploadPromise, {
                loading: 'Uploading...',
                success: (data) => {
                    const url = data
                    setFormState((prev) => ({
                        ...prev,
                        onboardingApplication: {
                            ...prev.onboardingApplication,
                            documents: {
                                ...prev.onboardingApplication?.documents,
                                [type]: url,
                            },
                        },
                    } as Partial<IUser>));
                    return {
                        message: `File Has Been Sucessfully Uploaded`,
                        description: '',
                    };
                },
                error: 'Error',
            });
        };

    const handleCancel = () => {
        if (confirm('Discard all changes?')) {
            setIsEditing(false);
            setFormState(userData || {});
        }
    };
    const handleSave = async () => {
        setIsEditing(false);
        if (!formState._id) {
            console.error("Missing userId in formState");
            return;
        }

        const tryUpdateUserData = await updateAllOnboardingApplicationAPI({
            userId: formState._id.toString(),
            ssn: formState.ssn || "",
            dateOfBirth: formState.dateOfBirth || new Date(),
            gender: formState.gender || "Other", // fallback value
            realName: formState.realName!,
            documents: formState.onboardingApplication?.documents!,
            address: formState.address!,
            contactInfo: formState.contactInfo!,
            employment: formState.employment!,
            emergencyContact: formState.emergencyContact!,
            reference: formState.onboardingApplication?.reference!,
            status: formState.onboardingApplication?.status || "Pending",
            feedback: formState.onboardingApplication?.feedback || "",
        });

        if (tryUpdateUserData) {
            toast.success('Update successful', { duration: 2000 });
            setUserData(formState as IUser);
        } else {
            toast.error('Update error', { duration: 2000 });
        }
    };

    return (
        <div className="flex flex-col min-h-screen pl-12 py-8">
            <div className="flex justify-between items-center pr-12">
                <h1 className="text-[40px] text-left font-semibold mb-6">Personal Information</h1>
                <div className="w-[150px] flex justify-between items-center">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="bg-[#2D68FE] text-white px-4 py-1 rounded w-full">Edit</button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="bg-[#2D68FE] text-white px-4 py-1 rounded w-1/2">Save</button>
                            <button onClick={handleCancel} className="bg-gray-300 text-black px-4 py-1 rounded w-1/2">Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 mr-12 space-y-6 text-left">
                <Section title="Name & Avatar">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            <img
                                className="w-20 h-20 rounded-full object-cover"
                                src={formState?.onboardingApplication?.documents?.profilePictureUrl || '/avatar.jpg'}
                                alt="avatar"
                            />
                            {isEditing && (
                                <>
                                    <label htmlFor="avatarUpload" className="cursor-pointer text-sm text-blue-600 mt-2 underline">
                                        Change Avatar
                                    </label>
                                    <input
                                        id="avatarUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                            {['FirstName', 'MiddleName', 'LastName', 'PreferredName'].map((key) =>
                                isEditing ? (
                                    <input
                                        key={key}
                                        type="text"
                                        value={(formState.realName as any)?.[key] || ''}
                                        onChange={(e) => handleNestedChange('realName', key, e.target.value)}
                                        className="border rounded p-1"
                                        placeholder={key.replace(/([A-Z])/g, ' $1')}
                                    />
                                ) : (
                                    <div key={key}>
                                        {key.replace(/([A-Z])/g, ' $1')}: {(formState.realName as any)?.[key] || 'N/A'}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </Section>

                <Section title="Address">
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={formState.address?.street || ''} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} className="border rounded p-1" placeholder="Street" />
                            <input type="text" value={formState.address?.building || ''} onChange={(e) => handleNestedChange('address', 'building', e.target.value)} className="border rounded p-1" placeholder="Building" />
                            <input type="text" value={formState.address?.city || ''} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} className="border rounded p-1" placeholder="City" />
                            <input type="text" value={formState.address?.state || ''} onChange={(e) => handleNestedChange('address', 'state', e.target.value)} className="border rounded p-1" placeholder="State" />
                            <input type="text" value={formState.address?.zip || ''} onChange={(e) => handleNestedChange('address', 'zip', e.target.value)} className="border rounded p-1" placeholder="ZIP" />
                        </div>
                    ) : (
                        <div>{formState.address ? `${formState.address.street}, ${formState.address.building}, ${formState.address.city}, ${formState.address.state} ${formState.address.zip}` : 'N/A'}</div>
                    )}
                </Section>

                <Section title="Contact Info">
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={formState.contactInfo?.cellPhone || ''} onChange={(e) => handleNestedChange('contactInfo', 'cellPhone', e.target.value)} className="border rounded p-1" placeholder="Cell Phone" />
                            <input type="text" value={formState.contactInfo?.workPhone || ''} onChange={(e) => handleNestedChange('contactInfo', 'workPhone', e.target.value)} className="border rounded p-1" placeholder="Work Phone" />
                            <input type="text" value={formState.contactInfo?.email || ''} onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)} className="border rounded p-1" placeholder="Email" />
                        </div>
                    ) : (
                        <>
                            <div>Cell Phone: {formState.contactInfo?.cellPhone || 'N/A'}</div>
                            <div>Work Phone: {formState.contactInfo?.workPhone || 'N/A'}</div>
                            <div>Email: {formState.contactInfo?.email || 'N/A'}</div>
                        </>
                    )}
                </Section>

                <Section title="Employment">
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-3">
                            <select value={formState.employment?.visaTitle || ''} onChange={(e) => handleNestedChange('employment', 'visaTitle', e.target.value)} className="border rounded p-1">
                                <option value="">Visa Title</option>
                                {visaOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <input type="date" value={formState.employment?.startDate ? new Date(formState.employment.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleNestedChange('employment', 'startDate', e.target.value)} className="border rounded p-1" />
                            <input type="date" value={formState.employment?.endDate ? new Date(formState.employment.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleNestedChange('employment', 'endDate', e.target.value)} className="border rounded p-1" />
                        </div>
                    ) : (
                        <>
                            <div>Visa Title: {formState.employment?.visaTitle || 'N/A'}</div>
                            <div>Start Date: {formState.employment?.startDate ? new Date(formState.employment.startDate).toLocaleDateString() : 'N/A'}</div>
                            <div>End Date: {formState.employment?.endDate ? new Date(formState.employment.endDate).toLocaleDateString() : 'N/A'}</div>
                        </>
                    )}
                </Section>

                <Section title="Emergency Contact">
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={formState.emergencyContact?.realName?.firstName || ''} onChange={(e) => handleDoubleNestedChange('emergencyContact', 'realName', 'firstName', e.target.value)} className="border rounded p-1" placeholder="First Name" />
                            <input type="text" value={formState.emergencyContact?.realName?.middleName || ''} onChange={(e) => handleDoubleNestedChange('emergencyContact', 'realName', 'middleName', e.target.value)} className="border rounded p-1" placeholder="Middle Name" />
                            <input type="text" value={formState.emergencyContact?.realName?.lastName || ''} onChange={(e) => handleDoubleNestedChange('emergencyContact', 'realName', 'lastName', e.target.value)} className="border rounded p-1" placeholder="Last Name" />
                            <input type="text" value={formState.emergencyContact?.contactInfo?.email || ''} onChange={(e) => handleDoubleNestedChange('emergencyContact', 'contactInfo', 'email', e.target.value)} className="border rounded p-1" placeholder="Email" />
                            <input type="text" value={formState.emergencyContact?.contactInfo?.cellPhone || ''} onChange={(e) => handleDoubleNestedChange('emergencyContact', 'contactInfo', 'cellPhone', e.target.value)} className="border rounded p-1" placeholder="Phone" />
                            <input type="text" value={formState.emergencyContact?.relationship || ''} onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)} className="border rounded p-1" placeholder="Relationship" />
                        </div>
                    ) : (
                        <>
                            <div>First Name: {formState.emergencyContact?.realName?.firstName || 'N/A'}</div>
                            <div>Middle Name: {formState.emergencyContact?.realName?.middleName || 'N/A'}</div>
                            <div>Last Name: {formState.emergencyContact?.realName?.lastName || 'N/A'}</div>
                            <div>Email: {formState.emergencyContact?.contactInfo?.email || 'N/A'}</div>
                            <div>Phone: {formState.emergencyContact?.contactInfo?.cellPhone || 'N/A'}</div>
                            <div>Relationship: {formState.emergencyContact?.relationship || 'N/A'}</div>
                        </>
                    )}
                </Section>

                <Section title="Documents">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Upload Driver's License</label>
                                <input type="file" accept="application/pdf,image/*" onChange={handleDocumentUpload('driverLicenseUrl')} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium">Upload Work Authorization</label>
                                <input type="file" accept="application/pdf,image/*" onChange={handleDocumentUpload('workAuthorizationUrl')} />
                            </div>
                        </div>
                    ) : (
                        <>
                            {userData?.onboardingApplication?.documents?.driverLicenseUrl && (
                                <div className="flex justify-between">
                                    <span>Driver’s License</span>
                                    <a href={userData.onboardingApplication.documents.driverLicenseUrl} target="_blank" className="text-blue-500" rel="noreferrer">
                                        Download
                                    </a>
                                </div>
                            )}
                            {userData?.onboardingApplication?.documents?.workAuthorizationUrl && (
                                <div className="flex justify-between">
                                    <span>Work Authorization</span>
                                    <a href={userData.onboardingApplication.documents.workAuthorizationUrl} target="_blank" className="text-blue-500" rel="noreferrer">
                                        Download
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </Section>
            </div>
        </div>
    );
}