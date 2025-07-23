import React, { useEffect, useState } from 'react'
import axios from 'axios'
import type { IUser } from '../../back-end/models/User'

export function EmployeeProfilesPage() {
    const [employees, setEmployees] = useState<IUser[]>([])

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get<IUser[]>('/api/users')
                setEmployees(res.data)
            } catch (err) {
                console.error('Failed to fetch employees:', err)
            }
        }

        fetchEmployees()
    }, [])

    return (
        <div className="flex flex-col min-h-screen pl-30 py-8">
            <h1 className="text-[40px] text-left font-semibold mb-6">Employee Profiles</h1>
            <div className="items-center gap-4 mb-6 w-1/2">
                <input
                    type="text"
                    placeholder="Search by first name, last name, preferred name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#F5F5F5] text-black font-semibold text-[16px] h-[65px]">
                        <tr>
                            <th className="px-6 py-3">Employee</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">SSN</th>
                            <th className="px-6 py-3">Phone Number</th>
                            <th className="px-6 py-3">Email</th>
                        </tr>
                    </thead>
                    {/* <tbody className="divide-y divide-gray-200">
                        {employees.map(emp => (
                            <tr key={emp._id.toString()} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {emp.realName?.firstName} {emp.realName?.lastName}
                                </td>
                                <td className="px-6 py-4">{emp.employment?.visaTitle}</td>
                                <td className="px-6 py-4">{emp.ssn}</td>
                                <td className="px-6 py-4">{emp.contactInfo?.cellPhone}</td>
                                <td className="px-6 py-4">{emp.email}</td>
                            </tr>
                        ))}
                    </tbody> */}
                </table>
            </div>
        </div >
    )
}
