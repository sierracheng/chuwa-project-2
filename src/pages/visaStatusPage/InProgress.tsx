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
  getInProgressVisaEmployeesAPI,
  updateReviewVisaStepAPI,
} from "@/back-end/api/visaStepsAPI"; 
import { sendEmailAPI } from "@/back-end/api/email";

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

// Utility to determine if we should show the "Send Notification" button
const shouldShowSendNotification = (row: VisaRow): boolean => {
  const step = row.currentStep;
  const next = row.nextStep?.toLowerCase();
  const visaStep = row.visaSteps[step];

  // Case 1: nextStep string includes "submit"
  if (next?.includes("submit")) return true;

  // Case 2: step is explicitly not uploaded
  if (visaStep?.status === "not_uploaded") return true;

  return false;
};


export const columns = (
  handleApprove: (row: VisaRow) => void,
  handleReject: (row: VisaRow) => void,
  handleNotification: (row: VisaRow) => void,
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
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const original = row.original;
      const step = original.currentStep;
      const docUrl = original.visaSteps[step]?.document?.url;
      const showNotifyButton = shouldShowSendNotification(original);
      // console.log("Current Step:", step);
      // console.log(original.visaSteps[step])
      // console.log("Document URL:", docUrl);


      return (
        <div className="flex flex-col items-center gap-1">
          {showNotifyButton ? (
            <Button
              variant="secondary"
              className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => handleNotification(original)}
            >
              Send Notification
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApprove(original)}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(original)}
                  className="hover:bg-red-600"
                >
                  Reject
                </Button>
              </div>

              {docUrl && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Preview Document
                </a>
              )}
            </>
          )}
        </div>
      );
    },
  },
];

export function InProgress() {
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
        const result = await getInProgressVisaEmployeesAPI();
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
          nextStep: e.nextStep,
          currentStep: e.currentStep,
          visaSteps: e.visaSteps,
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

  const handleApprove = async (row: VisaRow) => {
    try {
      const res = await updateReviewVisaStepAPI(row.userId, row.currentStep, "approved");
      if (res.success) {
        alert("Step approved successfully!");
        await fetchVisaRows(); // Refresh data after approval
      }
    } catch (error: any) {
        console.error("Error approving step:", error);
    }
  };

  const handleReject = async (row: VisaRow) => {
    const feedback = prompt("Provide rejection feedback:");
    if (!feedback) return;
    try {
      const res = await updateReviewVisaStepAPI(row.userId, row.currentStep, "rejected", feedback);
      if (res.success) {
        alert("Step rejected successfully!");
        await fetchVisaRows(); // Refresh data after rejection
      }
    } catch (error: any) {
      console.error("Error rejecting step:", error);
    }
  };

  const handleNotification = async (row: VisaRow) => {
    try {
    const stepLabel = row.currentStep;
    const subject = `Reminder: ${stepLabel}`;
    const text = `Hi ${row.name},\n\nThis is a reminder to ${stepLabel.toLowerCase()} for your visa process.\n\nPlease upload the document ASAP.`;

    await sendEmailAPI(
        row.email,
        subject,
        text,
        `<p>${text.replace(/\n/g, "<br />")}</p>`,
      );
    alert(`Notification sent to ${row.name}`);
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const table = useReactTable({
    data,
    columns: columns(handleApprove, handleReject, handleNotification),
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
              <TableRow key={group.id}>
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
                <TableRow key={row.id}>
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
    </div>
  );
}
