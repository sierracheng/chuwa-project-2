import React, { useEffect, useState } from 'react'
import axios from 'axios'
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


export type EmployeeProfiles = {
    employee: string
    title: string
    workAuth: string
    daysRemain: number
    nextStep: string
    action: string
}

const data: EmployeeProfiles[] = [
    {
        employee: "Aisha Doe",
        title: "Software Engineer",
        workAuth: "F-1 OPT June 15 2024 June 15 2024",
        daysRemain: 45,
        nextStep: "Submit Onboarding Application",
        action: "Send Notification"
    },
    {
        employee: "Aisha Doe",
        title: "Software Engineer",
        workAuth: "F-1 OPT June 15 2024 June 15 2024",
        daysRemain: 45,
        nextStep: "Submit Onboarding Application",
        action: "Send Notification"
    },
    {
        employee: "Aisha Doe",
        title: "Software Engineer",
        workAuth: "F-1 OPT June 15 2024 June 15 2024",
        daysRemain: 45,
        nextStep: "Submit Onboarding Application",
        action: "Send Notification"
    },
    {
        employee: "Aisha Doe",
        title: "Software Engineer",
        workAuth: "F-1 OPT June 15 2024 June 15 2024",
        daysRemain: 45,
        nextStep: "Submit Onboarding Application",
        action: "Send Notification"
    },
    {
        employee: "Aisha Doe",
        title: "Software Engineer",
        workAuth: "F-1 OPT June 15 2024 June 15 2024",
        daysRemain: 45,
        nextStep: "Submit Onboarding Application",
        action: "Send Notification"
    },
]

const columns: ColumnDef<EmployeeProfiles>[] = [

    {
        accessorKey: "employee",
        header: () => <h1 className="text-right">Employee</h1>,
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("employee")}</div>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "workAuth",
        header: "Work Authorization",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("workAuth")}</div>
        ),
    },
    {
        accessorKey: "daysRemain",
        header: "Days Remaining",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("daysRemain")}</div>
        ),
    },
    {
        accessorKey: "nextStep",
        header: "Next Steps",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nextStep")}</div>
        ),
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("action")}</div>
        ),
    },
]

export function EmployeeProfilesPage() {
    const [employees, setEmployees] = useState<IUser[]>([])
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
                const res = await axios.get<IUser[]>('/api/users')
                setEmployees(res.data)
            } catch (err) {
                console.error('Failed to fetch employees:', err)
            }
        }

        fetchEmployees()
    }, [])

    const table = useReactTable({
        data,
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
        <div className="flex flex-col min-h-screen pl-12 py-8">
            <h1 className="text-[40px] text-left font-semibold mb-6">Employee Profiles</h1>
            <div className="items-center gap-4 mb-6 w-1/2">
                <input
                    type="text"
                    placeholder="Search by first name, last name, preferred name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
                                            <TableCell key={cell.id}>
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
        </div >
    )
}




// "use client"

// import * as React from "react"
// import {
//     ColumnDef,
//     ColumnFiltersState,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     SortingState,
//     useReactTable,
//     VisibilityState,
// } from "@tanstack/react-table"
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//     DropdownMenu,
//     DropdownMenuCheckboxItem,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// const data: Payment[] = [
//     {
//         id: "m5gr84i9",
//         amount: 316,
//         status: "success",
//         email: "ken99@example.com",
//     },
//     {
//         id: "3u1reuv4",
//         amount: 242,
//         status: "success",
//         email: "Abe45@example.com",
//     },
//     {
//         id: "derv1ws0",
//         amount: 837,
//         status: "processing",
//         email: "Monserrat44@example.com",
//     },
//     {
//         id: "5kma53ae",
//         amount: 874,
//         status: "success",
//         email: "Silas22@example.com",
//     },
//     {
//         id: "bhqecj4p",
//         amount: 721,
//         status: "failed",
//         email: "carmella@example.com",
//     },
// ]

// export type Payment = {
//     id: string
//     amount: number
//     status: "pending" | "processing" | "success" | "failed"
//     email: string
// }

// export const columns: ColumnDef<Payment>[] = [
//     {
//         id: "select",
//         header: ({ table }) => (
//             <Checkbox
//                 checked={
//                     table.getIsAllPageRowsSelected() ||
//                     (table.getIsSomePageRowsSelected() && "indeterminate")
//                 }
//                 onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//                 aria-label="Select all"
//             />
//         ),
//         cell: ({ row }) => (
//             <Checkbox
//                 checked={row.getIsSelected()}
//                 onCheckedChange={(value) => row.toggleSelected(!!value)}
//                 aria-label="Select row"
//             />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//     },
//     {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => (
//             <div className="capitalize">{row.getValue("status")}</div>
//         ),
//     },
//     {
//         accessorKey: "email",
//         header: ({ column }) => {
//             return (
//                 <Button
//                     variant="ghost"
//                     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//                 >
//                     Email
//                     <ArrowUpDown />
//                 </Button>
//             )
//         },
//         cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//     },
//     {
//         accessorKey: "amount",
//         header: () => <div className="text-right">Amount</div>,
//         cell: ({ row }) => {
//             const amount = parseFloat(row.getValue("amount"))

//             // Format the amount as a dollar amount
//             const formatted = new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency: "USD",
//             }).format(amount)

//             return <div className="text-right font-medium">{formatted}</div>
//         },
//     },
//     {
//         id: "actions",
//         enableHiding: false,
//         cell: ({ row }) => {
//             const payment = row.original

//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem
//                             onClick={() => navigator.clipboard.writeText(payment.id)}
//                         >
//                             Copy payment ID
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>View customer</DropdownMenuItem>
//                         <DropdownMenuItem>View payment details</DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             )
//         },
//     },
// ]

// export function DataTableDemo() {
//     const [sorting, setSorting] = React.useState<SortingState>([])
//     const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//         []
//     )
//     const [columnVisibility, setColumnVisibility] =
//         React.useState<VisibilityState>({})
//     const [rowSelection, setRowSelection] = React.useState({})

//     const table = useReactTable({
//         data,
//         columns,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         onColumnVisibilityChange: setColumnVisibility,
//         onRowSelectionChange: setRowSelection,
//         state: {
//             sorting,
//             columnFilters,
//             columnVisibility,
//             rowSelection,
//         },
//     })

//     return (
//         <div className="w-full">
//             <div className="flex items-center py-4">
//                 <Input
//                     placeholder="Filter emails..."
//                     value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
//                     onChange={(event) =>
//                         table.getColumn("email")?.setFilterValue(event.target.value)
//                     }
//                     className="max-w-sm"
//                 />
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline" className="ml-auto">
//                             Columns <ChevronDown />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         {table
//                             .getAllColumns()
//                             .filter((column) => column.getCanHide())
//                             .map((column) => {
//                                 return (
//                                     <DropdownMenuCheckboxItem
//                                         key={column.id}
//                                         className="capitalize"
//                                         checked={column.getIsVisible()}
//                                         onCheckedChange={(value) =>
//                                             column.toggleVisibility(!!value)
//                                         }
//                                     >
//                                         {column.id}
//                                     </DropdownMenuCheckboxItem>
//                                 )
//                             })}
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//             <div className="overflow-hidden rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                                 {headerGroup.headers.map((header) => {
//                                     return (
//                                         <TableHead key={header.id}>
//                                             {header.isPlaceholder
//                                                 ? null
//                                                 : flexRender(
//                                                     header.column.columnDef.header,
//                                                     header.getContext()
//                                                 )}
//                                         </TableHead>
//                                     )
//                                 })}
//                             </TableRow>
//                         ))}
//                     </TableHeader>
//                     <TableBody>
//                         {table.getRowModel().rows?.length ? (
//                             table.getRowModel().rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     data-state={row.getIsSelected() && "selected"}
//                                 >
//                                     {row.getVisibleCells().map((cell) => (
//                                         <TableCell key={cell.id}>
//                                             {flexRender(
//                                                 cell.column.columnDef.cell,
//                                                 cell.getContext()
//                                             )}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell
//                                     colSpan={columns.length}
//                                     className="h-24 text-center"
//                                 >
//                                     No results.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>
//             <div className="flex items-center justify-end space-x-2 py-4">
//                 <div className="text-muted-foreground flex-1 text-sm">
//                     {table.getFilteredSelectedRowModel().rows.length} of{" "}
//                     {table.getFilteredRowModel().rows.length} row(s) selected.
//                 </div>
//                 <div className="space-x-2">
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.previousPage()}
//                         disabled={!table.getCanPreviousPage()}
//                     >
//                         Previous
//                     </Button>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => table.nextPage()}
//                         disabled={!table.getCanNextPage()}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }
