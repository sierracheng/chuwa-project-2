"use client";

import React, { use, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
    getAllVisaEmployeesAPI
} from "@/back-end/api/visaStepsAPI"; 
import { icons } from '../../constants/icons';

export type VisaRow = {
  id: string;
  userId: string;
  name: string;
  email: string;
  visaTitle: string;
  daysRemaining: number;
  nextStep: string;
  currentStep: "optReceipt" | "optEAD" | "i983" | "i20";
  visaSteps: {
    [key in "optReceipt" | "optEAD" | "i983" | "i20"]: {
      status: string;
      document?: {
        url?: string;
        uploadedAt?: string;
      };
      feedback?: string;
    };
  };
};

export const columns = (

): ColumnDef<VisaRow>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "visaTitle",
    header: "Visa Title",
  },
    {
    accessorKey: "VisaStartDate",
    header: "Visa Start Date",
  },
  {
    accessorKey: "VisaEndDate",
    header: "Visa End Date",
  },
  {
    accessorKey: "daysRemaining",
    header: "Days Remaining",
  },
  {
    accessorKey: "nextStep",
    header: "Next Step",
  },
  {
    id: "documents",
    header: "Documents",
    cell: ({ row }) => {
        const steps = row.original.visaSteps;

        const display = (stepKey: keyof typeof steps, label: string) => {
            const doc = steps[stepKey]?.document;
            if(!doc || !doc.url) {
                return <span className="text-gray-500">None</span>;
            }
            return (
                <div key={stepKey} className="flex flex-col text-sm">
                    <span className="font-semibold">{label}:</span>
                    <div className="flex justify-between gap-2 w-full">
                        <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                          View Document
                        </a>
                        <a
                            href={doc.url}
                            download
                            className="ml-2 text-blue-500 hover:underline"
                        >
                            Download
                        </a>
                    </div>
                </div>
            );
        };
        return (
            <div className="flex flex-col gap-2">
                {display("optReceipt", "OPT Receipt")}
                {display("optEAD", "OPT EAD")}
                {display("i983", "I-983")}
                {display("i20", "I-20")}
            </div>
        );
    },
  },
];

export function All() {
  const [data, setData] = useState<VisaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // fetch data
  const fetchVisaRows = async () => {
    setLoading(true);
      try {
        const result = await getAllVisaEmployeesAPI();
        console.log("All Visa API result:", result);
        if (!result.success) {
          setError("Failed to fetch visa employees.");
          return;
        }
      
        const formatDate = (dateString: string): string => {
          if (!dateString || dateString === "Unknown") return "Unknown";
          
          try {
            const date = new Date(dateString);
            // Format as YYYY-MM-DD
            return date.toISOString().split('T')[0];
          } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
          }
        };

      const transformed = result.employees.map((e: any) => {
        return {
          id: e._id,
          userId: e.userId,
          name: `${e.realName.firstName} ${e.realName.lastName}`,
          email: e.email,
          visaTitle: e.employment?.visaTitle || "Unknown",
          VisaStartDate: formatDate(e.employment?.startDate) || "Unknown",
          VisaEndDate: formatDate(e.employment?.endDate) || "Unknown",
          daysRemaining: e.employment?.daysRemaining ?? 0,
          visaSteps: e.visaSteps,
          nextStep: e.nextStep || "Unknown",
        };
      });
        console.log("Transformed data:", transformed);
        setData(transformed);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

  //hook to fetch data on component mount
  useEffect(() => {
    fetchVisaRows();
  }, []);


  const table = useReactTable({
    data,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="text-left">
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="text-left">
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
                <TableCell colSpan={8} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
  );
}
