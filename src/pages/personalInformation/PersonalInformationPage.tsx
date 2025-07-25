import React, { useEffect, useState } from 'react'
import axios from 'axios'
import type { IUser } from '../../back-end/models/User'
import Section from "../../components/ui/section"

export function PersonalInformationPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveMessage, setShowSaveMessage] = useState(false);


    const handleCancel = () => {
        if (confirm("Discard all changes?")) {
            setIsEditing(false);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        setShowSaveMessage(true);

        setTimeout(() => {
            setShowSaveMessage(false)
        }, 3000)
    }

    return (
        <div className="flex flex-col min-h-screen pl-12 py-8">

            <div className="flex justify-between items-center pr-12">
                <h1 className="text-[40px] text-left font-semibold mb-6">Personal Information</h1>

                {showSaveMessage &&
                    <div className="fixed bottom-16 right-6 bg-white border border-green-400 shadow-lg rounded-lg px-6 py-4 flex items-center gap-3 transition-all duration-300 z-50">
                        <svg
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span className="text-green-700 font-medium text-sm">
                            All changes have been saved.
                        </span>
                    </div>
                }

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

                {/* Name Section */}
                <Section title="Name" editable={isEditing}>
                    <div className="flex items-center gap-4">
                        <img className="w-16 h-16 rounded-full object-cover" src="/avatar.jpg" alt="avatar" />
                        <div>
                            <div>Grace</div>
                            <div>Zhao</div>
                        </div>
                        <div className="ml-auto text-sm space-y-1">
                            <div>Email: grace</div>
                            <div>SSN: ••••••••</div>
                            <div>DOB: 01/23/1960</div>
                            <div>Gender: Female</div>
                        </div>
                    </div>
                </Section>

                {/* Address */}
                <Section title="Address" editable={isEditing}>
                    <div>1234 Elm St, Springfield, IL 62701</div>
                </Section>

                {/* Contact Info */}
                <Section title="Contact Info" editable={isEditing}>
                    <div>Cell Phone: (123) 56-78860</div>
                </Section>

                {/* Employment */}
                <Section title="Employment" editable={isEditing}>
                    <div>Visa Title: H-1B</div>
                    <div>Start Date: 03/15/2021</div>
                    <div>End Date: 03/14/2024</div>
                </Section>

                {/* Emergency Contact */}
                <Section title="Emergency Contact" editable={isEditing}>
                    <div>First Name: John</div>
                    <div>Middle Name: Smith</div>
                    <div>Phone: (234) 567-9901</div>
                    <div>Email: john.smith@example.com</div>
                </Section>

                {/* Documents */}
                <Section title="Documents" editable={false}>
                    <div className="flex justify-between">
                        <span>Driver’s License</span>
                        <span className="space-x-4 text-blue-500">
                            <a href="#">Download</a>
                            <a href="#">Preview</a>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Work Authorization</span>
                        <span className="space-x-4 text-blue-500">
                            <a href="#">Download</a>
                            <a href="#">Preview</a>
                        </span>
                    </div>
                </Section>

            </div>


        </div>
    )
}