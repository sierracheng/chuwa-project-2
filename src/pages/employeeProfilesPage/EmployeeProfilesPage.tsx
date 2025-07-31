import { useEffect, useState } from 'react'
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
import { icons } from '../../constants/icons'


export type EmployeeProfiles = {
    id: string
    employee: string
    profilePictureUrl?: string
    title: string
    workAuth: string
    ssn: number
    phoneNumber: string
    email: string
    fullName: {
        firstName: string
        lastName: string
        preferredName: string
    }
}

const columns: ColumnDef<EmployeeProfiles>[] = [

    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const name = row.getValue("employee") as string;
            const id = row.original.id;
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
                    <a
                        href={`/hr/employee/profile?id=${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="capitalize text-black hover:underline"
                    >{name}</a>
                    {/* <span className="capitalize">{name}</span> */}
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
    const [allEmployees, setAllEmployees] = useState<EmployeeProfiles[]>([]);
    const [employees, setEmployees] = useState<EmployeeProfiles[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [pagination, setPagination] = useState(() => ({
        pageIndex: Number(localStorage.getItem("employeePageIndex") || 0),
        pageSize: 8,
    }));

    useEffect(() => {
        const filtered = allEmployees.filter(emp => {
            const { firstName, lastName, preferredName } = emp.fullName || {};
            const lowerSearch = searchTerm.toLowerCase();
            return (
                firstName.toLowerCase().includes(lowerSearch) ||
                lastName.toLowerCase().includes(lowerSearch) ||
                preferredName.toLowerCase().includes(lowerSearch)
            );
        });
        setEmployees(filtered);
    }, [debouncedSearch, allEmployees]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        localStorage.setItem("employeePageIndex", pagination.pageIndex.toString());
    }, [pagination.pageIndex]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await getEmployeesDataAPI()
                //console.log(res)
                if (res && res.length > 0) {
                    const employeeProfiles: EmployeeProfiles[] = res.map((user: IUser) => ({
                        id: user._id.toString(),
                        employee: user.realName?.firstName + " " + user.realName?.lastName,
                        profilePictureUrl: user.onboardingApplication?.documents?.profilePictureUrl || "",
                        workAuth: user.employment.visaTitle || "",
                        ssn: user.ssn,
                        phoneNumber: user.contactInfo?.cellPhone || "",
                        email: user.email,
                        fullName: {
                            firstName: user.realName?.firstName || "",
                            lastName: user.realName?.lastName || "",
                            preferredName: user.realName?.preferredName || "",
                        }
                    }));
                    console.log(employeeProfiles)
                    employeeProfiles.sort((a, b) => {
                        return a.fullName.lastName.localeCompare(b.fullName.lastName);
                    })
                    setAllEmployees(employeeProfiles);
                    setEmployees(employeeProfiles);
                }


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
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        initialState: {
            pagination,
        }
    })

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold mb-8 text-gray-900 text-left">Employee Profiles</h1>
            <div className="flex flex-row items-center gap-4 mb-6 w-full max-w-2xl">
                <input
                    type="text"
                    placeholder="Search by first name, last name, preferred name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 text-sm text-gray-600">
                <div className="mb-2 md:mb-0">
                    Showing{" "}
                    <span className="font-semibold">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{table.getFilteredRowModel().rows.length}</span>{" "}
                    employees
                </div>

                <div className="flex gap-2 items-center justify-center">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="w-8 h-8 flex items-center justify-center border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    >
                        {icons.ARROWLEFT}
                    </button>

                    {Array.from({ length: table.getPageCount() }, (_, i) => i).map((page, index) => {
                        const isCurrent = page === table.getState().pagination.pageIndex;
                        if (
                            page === 0 ||
                            page === table.getPageCount() - 1 ||
                            Math.abs(page - table.getState().pagination.pageIndex) <= 1
                        ) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => table.setPageIndex(page)}
                                    className={`w-8 h-8 border rounded-md flex items-center justify-center ${isCurrent ? "bg-blue-600 text-white font-bold" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {page + 1}
                                </button>
                            );
                        } else if (
                            (page === table.getState().pagination.pageIndex - 2 && page !== 0 + 1) ||
                            (page === table.getState().pagination.pageIndex + 2 &&
                                page !== table.getPageCount() - 2)
                        ) {
                            return (
                                <span key={index} className="px-1 text-gray-400">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="w-8 h-8 flex items-center justify-center border rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                    >
                        {icons.ARROWRIGHT}
                    </button>
                </div>
            </div>
        </div>

    )
}
