import { useEffect, useMemo, useState } from 'react';
import type { IUser } from '../../back-end/models/User';
import Section from '../../components/ui/section';
import { getUserDataAPI } from '@/back-end/api/userAPI';
import { useSearchParams } from "react-router-dom";


export function EmployeeProfileHrPage() {
    const [searchParams] = useSearchParams()
    const userId = searchParams.get("id");

    const [userData, setUserData] = useState<IUser | null>(null);
    const [formState, setFormState] = useState<Partial<IUser>>({});


    const initials = useMemo(() => {
        return (userData?.realName.firstName[0] ?? '') + (userData?.realName.lastName[0] ?? '')
    }, [userData])


    useEffect(() => {
        async function fetchUserData() {
            if (!userId) return;

            try {
                const data = await getUserDataAPI(userId);
                setUserData(data);
                setFormState(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, [userId]);

    return (
        <div className="flex flex-col min-h-screen pl-12 py-8">
            <div className="flex justify-between items-center pr-12">
                <h1 className="text-[40px] text-left font-semibold mb-6">{userData?.realName.firstName}'s Profile</h1>
            </div>

            <div className="mt-6 mr-12 space-y-6 text-left">
                <Section title="Name & Avatar">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                            {formState?.onboardingApplication?.documents?.profilePictureUrl ?
                                <img
                                    className="w-20 h-20 rounded-full object-cover"
                                    src={formState?.onboardingApplication?.documents?.profilePictureUrl || '/avatar.jpg'}
                                    alt="avatar"
                                /> :
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                    {initials}
                                </div>

                            }
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                            {['FirstName', 'MiddleName', 'LastName', 'PreferredName'].map((key) => (
                                <div key={key}>
                                    {key.replace(/([A-Z])/g, ' $1')}: {(formState.realName as any)?.[key] || 'N/A'}
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                <Section title="Address">
                    <div>{formState.address ? `${formState.address.street}, ${formState.address.building}, ${formState.address.city}, ${formState.address.state} ${formState.address.zip}` : 'N/A'}</div>
                </Section>

                <Section title="Contact Info">
                    <div>Cell Phone: {formState.contactInfo?.cellPhone || 'N/A'}</div>
                    <div>Work Phone: {formState.contactInfo?.workPhone || 'N/A'}</div>
                    <div>Email: {formState.contactInfo?.email || 'N/A'}</div>
                </Section>

                <Section title="Employment">
                    <div>Visa Title: {formState.employment?.visaTitle || 'N/A'}</div>
                    <div>Start Date: {formState.employment?.startDate ? new Date(formState.employment.startDate).toLocaleDateString() : 'N/A'}</div>
                    <div>End Date: {formState.employment?.endDate ? new Date(formState.employment.endDate).toLocaleDateString() : 'N/A'}</div>
                </Section>

                <Section title="Emergency Contact">
                    <div>First Name: {formState.emergencyContact?.realName?.firstName || 'N/A'}</div>
                    <div>Middle Name: {formState.emergencyContact?.realName?.middleName || 'N/A'}</div>
                    <div>Last Name: {formState.emergencyContact?.realName?.lastName || 'N/A'}</div>
                    <div>Email: {formState.emergencyContact?.contactInfo?.email || 'N/A'}</div>
                    <div>Phone: {formState.emergencyContact?.contactInfo?.cellPhone || 'N/A'}</div>
                    <div>Relationship: {formState.emergencyContact?.relationship || 'N/A'}</div>
                </Section>

                <Section title="Documents">
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
                </Section>
            </div>
        </div>
    );
}
