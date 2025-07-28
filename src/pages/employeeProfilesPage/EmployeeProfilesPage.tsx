import React, { useEffect, useState } from 'react'
import type { IUser } from '../../back-end/models/User'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import { getEmployeesDataAPI } from '@/back-end/api/userAPI'


export type EmployeeProfiles = {
    employee: string
    profilePictureUrl?: string
    title: string
    workAuth: string
    ssn: number
    phoneNumber: string
    email: string
}

const columns: ColumnDef<EmployeeProfiles>[] = [

    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const name = row.getValue("employee") as string;
            const imageUrl = row.original.profilePictureUrl;
            const initials = name
                .split(" ")
                .map((n) => n[0])
                .join("");

            return (
                <div className="flex items-center gap-3">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                            {initials}
                        </div>
                    )}
                    <span className="capitalize">{name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "workAuth",
        header: "Work Authorization",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("workAuth")}</div>
        ),
    },
    {
        accessorKey: "ssn",
        header: "ssn",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("ssn")}</div>
        ),
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("phoneNumber")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("email")}</div>
        ),
    },
]

export function EmployeeProfilesPage() {
    const [employees, setEmployees] = useState<EmployeeProfiles[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await getEmployeesDataAPI()
                console.log(res)
                if (res && res.length > 0) {
                    const employeeProfiles: EmployeeProfiles[] = res.map((user: IUser) => ({
                        employee: user.realName?.firstName + " " + user.realName?.lastName,
                        profilePictureUrl: user.onboardingApplication?.documents?.profilePictureUrl || "",
                        workAuth: user.employment.visaTitle || "",  // assuming visa type is stored here
                        ssn: user.ssn,                  // ensure it's a number
                        phoneNumber: user.contactInfo?.cellPhone || "",
                        email: user.email,
                    }));
                    setEmployees(employeeProfiles)
                }


                //setEmployees(res.data)
            } catch (err) {
                console.error('Failed to fetch employees:', err)
            }
        }

        fetchEmployees()
    }, [])

    const table = useReactTable({
        data: employees,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 text-left">Employee Profiles</h1>
            <div className="flex flex-row items-center gap-4 mb-6 w-full max-w-2xl">
                <input
                    type="text"
                    placeholder="Search by first name, last name, preferred name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm hover:bg-gray-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-5.414 5.414A1 1 0 0014 12v5.586l-4 4V12a1 1 0 00-.293-.707L4.293 6.707A1 1 0 014 6V4z" />
                    </svg>
                    Filter
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="bg-gray-50 text-gray-600 font-medium text-sm px-6 py-3 text-left" >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>

    )
}
