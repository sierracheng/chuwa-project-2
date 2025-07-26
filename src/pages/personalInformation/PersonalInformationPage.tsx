import React, { useEffect, useState } from 'react';
import type { IUser } from '../../back-end/models/User';
import Section from "../../components/ui/section";
import { getUserDataAPI } from '@/back-end/api/userAPI';

export function PersonalInformationPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [formState, setFormState] = useState<Partial<IUser>>({});

    useEffect(() => {
        async function fetchUserData() {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            const data = await getUserDataAPI(userId);
            if (data) {
                setUserData(data);
                setFormState(data);
            }
        }
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section: string, key: string, value: string) => {
        setFormState(prev => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [key]: value
            }
        }));
    };

    const handleDoubleNestedChange = (section: string, subsection: string, key: string, value: string) => {
        setFormState(prev => ({
            ...prev,
            [section]: {
                ...(prev as any)[section],
                [subsection]: {
                    ...(prev as any)[section]?.[subsection],
                    [key]: value
                }
            }
        }));
    };

    const handleCancel = () => {
        if (confirm("Discard all changes?")) {
            setIsEditing(false);
            setFormState(userData || {});
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        setUserData(formState as IUser);
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 3000);
    };

    return (
        <div className="flex flex-col min-h-screen pl-12 py-8">
            <div className="flex justify-between items-center pr-12">
                <h1 className="text-[40px] text-left font-semibold mb-6">Personal Information</h1>

                {showSaveMessage && (
                    <div className="fixed bottom-16 right-6 bg-white border border-green-400 shadow-lg rounded-lg px-6 py-4 flex items-center gap-3 transition-all duration-300 z-50">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-700 font-medium text-sm">All changes have been saved.</span>
                    </div>
                )}

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
                <Section title="Name" >
                    <div className="flex items-center gap-4">
                        <img className="w-16 h-16 rounded-full object-cover" src={formState?.onboardingApplication?.documents?.profilePictureUrl || "/avatar.jpg"} alt="avatar" />
                        <div className="space-y-1">
                            {isEditing ? (
                                <>
                                    <input type="text" value={formState.realName?.firstName || ""} onChange={e => handleNestedChange('realName', 'firstName', e.target.value)} className="border rounded p-1" placeholder="First Name" />
                                    <input type="text" value={formState.realName?.middleName || ""} onChange={e => handleNestedChange('realName', 'middleName', e.target.value)} className="border rounded p-1" placeholder="Middle Name" />
                                    <input type="text" value={formState.realName?.lastName || ""} onChange={e => handleNestedChange('realName', 'lastName', e.target.value)} className="border rounded p-1" placeholder="Last Name" />
                                    <input type="text" value={formState.realName?.preferredName || ""} onChange={e => handleNestedChange('realName', 'preferredName', e.target.value)} className="border rounded p-1" placeholder="Preferred Name" />
                                </>
                            ) : (
                                <>
                                    <div>First Name: {formState.realName?.firstName || "N/A"}</div>
                                    <div>Middle Name: {formState.realName?.middleName || "N/A"}</div>
                                    <div>Last Name: {formState.realName?.lastName || "N/A"}</div>
                                    <div>Preferred Name: {formState.realName?.preferredName || "N/A"}</div>
                                </>
                            )}
                        </div>
                        <div className="ml-auto text-sm space-y-1">
                            {isEditing ? (
                                <>
                                    <input type="email" name="email" value={formState.email || ""} onChange={handleChange} className="border rounded p-1" placeholder="Email" />
                                    <input type="text" name="ssn" value={formState.ssn || ""} onChange={handleChange} className="border rounded p-1" placeholder="SSN" />
                                    <input type="date" name="dateOfBirth" value={formState.dateOfBirth ? new Date(formState.dateOfBirth).toISOString().split('T')[0] : ""} onChange={handleChange} className="border rounded p-1" />
                                    <select name="gender" value={formState.gender || ""} onChange={handleChange} className="border rounded p-1">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </>
                            ) : (
                                <>
                                    <div>Email: {formState.email || "N/A"}</div>
                                    <div>SSN: {formState.ssn || "N/A"}</div>
                                    <div>DOB: {formState.dateOfBirth ? new Date(formState.dateOfBirth).toLocaleDateString() : "N/A"}</div>
                                    <div>Gender: {formState.gender || "N/A"}</div>
                                </>
                            )}
                        </div>
                    </div>
                </Section>

                <Section title="Address" >
                    {isEditing ? (
                        <>
                            <input type="text" value={formState.address?.street || ""} onChange={e => handleNestedChange('address', 'street', e.target.value)} className="border rounded p-1 mr-2" placeholder="Street" />
                            <input type="text" value={formState.address?.building || ""} onChange={e => handleNestedChange('address', 'building', e.target.value)} className="border rounded p-1 mr-2" placeholder="Building" />
                            <input type="text" value={formState.address?.city || ""} onChange={e => handleNestedChange('address', 'city', e.target.value)} className="border rounded p-1 mr-2" placeholder="City" />
                            <input type="text" value={formState.address?.state || ""} onChange={e => handleNestedChange('address', 'state', e.target.value)} className="border rounded p-1 mr-2" placeholder="State" />
                            <input type="text" value={formState.address?.zip || ""} onChange={e => handleNestedChange('address', 'zip', e.target.value)} className="border rounded p-1" placeholder="ZIP" />
                        </>
                    ) : (
                        <div>{formState.address ? `${formState.address.street}, ${formState.address.building}, ${formState.address.city}, ${formState.address.state} ${formState.address.zip}` : "N/A"}</div>
                    )}
                </Section>

                <Section title="Contact Info" >
                    {isEditing ? (
                        <>
                            <input type="text" value={formState.contactInfo?.cellPhone || ""} onChange={e => handleNestedChange('contactInfo', 'cellPhone', e.target.value)} className="border rounded p-1 mr-2" placeholder="Cell Phone" />
                            <input type="text" value={formState.contactInfo?.workPhone || ""} onChange={e => handleNestedChange('contactInfo', 'workPhone', e.target.value)} className="border rounded p-1 mr-2" placeholder="Work Phone" />
                            <input type="text" value={formState.contactInfo?.email || ""} onChange={e => handleNestedChange('contactInfo', 'email', e.target.value)} className="border rounded p-1" placeholder="Email" />
                        </>
                    ) : (
                        <>
                            <div>Cell Phone: {formState.contactInfo?.cellPhone || "N/A"}</div>
                            <div>Work Phone: {formState.contactInfo?.workPhone || "N/A"}</div>
                            <div>Email: {formState.contactInfo?.email || "N/A"}</div>
                        </>
                    )}
                </Section>

                <Section title="Employment" >
                    {isEditing ? (
                        <>
                            <select value={formState.employment?.visaTitle || ""} onChange={e => handleNestedChange('employment', 'visaTitle', e.target.value)} className="border rounded p-1 mr-2">
                                <option value="">Visa Title</option>
                                <option value="Citizen">Citizen</option>
                                <option value="Green Card">Green Card</option>
                                <option value="International">International</option>
                                <option value="H1B">H1B</option>
                                <option value="L2">L2</option>
                                <option value="F1 (CPT, OPT)">F1 (CPT, OPT)</option>
                                <option value="H4">H4</option>
                                <option value="Other">Other</option>
                            </select>
                            <input type="date" value={formState.employment?.startDate ? new Date(formState.employment.startDate).toISOString().split('T')[0] : ""} onChange={e => handleNestedChange('employment', 'startDate', e.target.value)} className="border rounded p-1 mr-2" />
                            <input type="date" value={formState.employment?.endDate ? new Date(formState.employment.endDate).toISOString().split('T')[0] : ""} onChange={e => handleNestedChange('employment', 'endDate', e.target.value)} className="border rounded p-1" />
                        </>
                    ) : (
                        <>
                            <div>Visa Title: {formState.employment?.visaTitle || "N/A"}</div>
                            <div>Start Date: {formState.employment?.startDate ? new Date(formState.employment.startDate).toLocaleDateString() : "N/A"}</div>
                            <div>End Date: {formState.employment?.endDate ? new Date(formState.employment.endDate).toLocaleDateString() : "N/A"}</div>
                        </>
                    )}
                </Section>

                <Section title="Emergency Contact" >
                    {isEditing ? (
                        <>
                            <input type="text" value={formState.emergencyContact?.realName?.firstName || ""} onChange={e => handleDoubleNestedChange('emergencyContact', 'realName', 'firstName', e.target.value)} className="border rounded p-1 mr-2" placeholder="First Name" />
                            <input type="text" value={formState.emergencyContact?.realName?.middleName || ""} onChange={e => handleDoubleNestedChange('emergencyContact', 'realName', 'middleName', e.target.value)} className="border rounded p-1 mr-2" placeholder="Middle Name" />
                            <input type="text" value={formState.emergencyContact?.realName?.lastName || ""} onChange={e => handleDoubleNestedChange('emergencyContact', 'realName', 'lastName', e.target.value)} className="border rounded p-1 mr-2" placeholder="Last Name" />
                            <input type="text" value={formState.emergencyContact?.contactInfo?.email || ""} onChange={e => handleDoubleNestedChange('emergencyContact', 'contactInfo', 'email', e.target.value)} className="border rounded p-1 mr-2" placeholder="Email" />
                            <input type="text" value={formState.emergencyContact?.contactInfo?.cellPhone || ""} onChange={e => handleDoubleNestedChange('emergencyContact', 'contactInfo', 'cellPhone', e.target.value)} className="border rounded p-1 mr-2" placeholder="Phone" />
                            <input type="text" value={formState.emergencyContact?.relationship || ""} onChange={e => handleNestedChange('emergencyContact', 'relationship', e.target.value)} className="border rounded p-1" placeholder="Relationship" />
                        </>
                    ) : (
                        <>
                            <div>First Name: {formState.emergencyContact?.realName?.firstName || "N/A"}</div>
                            <div>Middle Name: {formState.emergencyContact?.realName?.middleName || "N/A"}</div>
                            <div>Last Name: {formState.emergencyContact?.realName?.lastName || "N/A"}</div>
                            <div>Email: {formState.emergencyContact?.contactInfo.email || "N/A"}</div>
                            <div>Phone: {formState.emergencyContact?.contactInfo.cellPhone || "N/A"}</div>
                            <div>Relationship: {formState.emergencyContact?.relationship || "N/A"}</div>
                        </>
                    )}
                </Section>
            </div>
        </div>
    );
}
