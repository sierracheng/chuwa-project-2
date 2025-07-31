import {
  getOnboardingApplicationAPI,
  getUserDocumentObjectAPI,
  updateOnboardingFeedbackAPI,
  updateOnboardingStatusAPI,
} from "@/back-end/api/onboardingAPI";

import { getEmployeesDataAPI } from "@/back-end/api/userAPI";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { icons } from "@/constants/icons";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Employee = {
  _id: string;
  realName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  documents: {
    profilePictureUrl: string;
  };
  status: string;
};

// Define table columns
const columns: ColumnDef<Employee>[] = [
  {
    header: "Employee",
    id: "fullName",
    accessorFn: (row) => `${row.realName.firstName} ${row.realName.lastName}`,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Application",
    accessorKey: "status",
  },
  {
    header: "Action",
    accessorKey: "action",
  },
];

const OnboardingPage = () => {
  // Local State
  const [isLoading, setIsLoading] = useState(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // React Table instance
  const table = useReactTable({
    data: allEmployees,
    columns,
    state: {
      globalFilter: debouncedSearch,
    },
    initialState: {
      pagination: {
        pageSize: 8,
        pageIndex: 0,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const fullName =
        `${row.original.realName.firstName} ${row.original.realName.lastName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  });

  // Initial fetch of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      const employees = await getEmployeesDataAPI();
      const filteredEmployees = employees.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (employee: { onboardingApplication: any }) =>
          employee.onboardingApplication
      );

      const newEmployees = await Promise.all(
        filteredEmployees.map(async (employee: { _id: string }) => {
          try {
            const documents = await getUserDocumentObjectAPI(employee._id);
            const onboardingApplication = await getOnboardingApplicationAPI(
              employee._id
            );
            const status = onboardingApplication.onboardingApplication.status;
            return {
              ...employee,
              documents,
              status,
            };
          } catch (error) {
            console.error("Error getting documents:", error);
            throw error;
          }
        })
      );
      setAllEmployees(newEmployees);
      setIsLoading(false);
    };

    fetchEmployees();
  }, []);

  // Handle approve application
  const handleApproveApplication = async (userId: string) => {
    console.log("Approve application for user:", userId);
    try {
      const response = await updateOnboardingStatusAPI(userId, "approved");
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error("Error handle approving application:", error);
    }
  };

  // Handle reject application
  const handleRejectApplication = async (userId: string) => {
    console.log("Reject application for user:", userId);
    setCurrentUserId(userId);
    setRejectionFeedback("");
    setIsRejecting(true);
  };

  const handleConfirmReject = async () => {
    if (currentUserId) {
      try {
        const statusRes = await updateOnboardingStatusAPI(
          currentUserId,
          "rejected"
        );
        const feedbackRes = await updateOnboardingFeedbackAPI(
          currentUserId,
          rejectionFeedback
        );

        console.log("Status Response:", statusRes);
        console.log("Feedback Response:", feedbackRes);

        // Reset the state
        setIsRejecting(false);
        setCurrentUserId(null);
        setRejectionFeedback("");
        window.location.reload();
      } catch (error) {
        console.error("Error handle confirming reject:", error);
      }
    }
  };

  return (
    <div className="w-full relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 mb-1 w-full">
        <div className="flex flex-row items-center gap-4 mb-1 w-full max-w-2xl">
          <Input
            placeholder="Search by name..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* All and Three Status Buttons */}
      <div className="flex flex-row items-center gap-8 mb-4">
        <Button
          variant="outline"
          className="border-gray-500 bg-transparent text-gray-600 hover:bg-gray-100 cursor-pointer"
          onClick={() => setSelectedStatus(null)}
        >
          <span>All</span>
        </Button>
        <Button
          variant="outline"
          className="border-yellow-500 bg-transparent text-yellow-600 hover:bg-yellow-100 cursor-pointer"
          onClick={() => setSelectedStatus("pending")}
        >
          <span>Pending</span>
        </Button>
        <Button
          variant="outline"
          className="border-red-500 bg-transparent text-red-600 hover:bg-red-100 cursor-pointer"
          onClick={() => setSelectedStatus("rejected")}
        >
          <span>Rejected</span>
        </Button>
        <Button
          variant="outline"
          className="border-green-500 bg-transparent text-green-600 hover:bg-green-100 cursor-pointer"
          onClick={() => setSelectedStatus("approved")}
        >
          <span>Approved</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Employee</TableHead>
                <TableHead className="text-left">Email</TableHead>
                <TableHead className="text-left">Application</TableHead>
                <TableHead className="text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedStatus &&
                allEmployees
                  .filter((employee) =>
                    selectedStatus ? employee.status === selectedStatus : true
                  )
                  .map((employee) => (
                    <TableRow
                      key={employee._id}
                      className="border-b-1 border-gray-300"
                    >
                      <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                          <img
                            src={employee.documents.profilePictureUrl}
                            alt="Profile Picture"
                            className="w-10 h-10 rounded-full"
                          />
                          {employee.realName.firstName}{" "}
                          {employee.realName.lastName}
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex flex-col">
                          <span>{employee.email}</span>
                        </div>
                      </TableCell>
                      {/* Click the url to view the application */}
                      <TableCell className="text-left">
                        <div className="text-blue-500 cursor-pointer flex flex-col">
                          <a
                            href={`/hr/hiring/viewApplication?userId=${employee._id}`}
                          >
                            View Application
                          </a>
                          <span className="text-sm text-gray-500">
                            {employee.status}
                          </span>
                        </div>
                      </TableCell>
                      {/* Button to approve or reject the application */}
                      <TableCell className="text-left">
                        <div className="flex flex-row gap-2">
                          <Button
                            onClick={() => {
                              handleApproveApplication(employee._id);
                            }}
                            className="bg-blue-500 text-white hover:bg-green-500 cursor-pointer"
                          >
                            <span>Approve</span>
                          </Button>
                          <Button
                            onClick={() => {
                              handleRejectApplication(employee._id);
                            }}
                            className="bg-white text-black cursor-pointer border hover:bg-red-500 border-gray-300"
                          >
                            <span>Reject</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              {!selectedStatus &&
                table
                  .getPaginationRowModel()
                  .rows.map(({ original: employee }) => (
                    <TableRow
                      key={employee._id}
                      className="border-b-1 border-gray-300"
                    >
                      <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                          <img
                            src={employee.documents.profilePictureUrl}
                            alt="Profile Picture"
                            className="w-10 h-10 rounded-full"
                          />
                          {employee.realName.firstName}{" "}
                          {employee.realName.lastName}
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex flex-col">
                          <span>{employee.email}</span>
                        </div>
                      </TableCell>
                      {/* Click the url to view the application */}
                      <TableCell className="text-left">
                        <div className="text-blue-500 cursor-pointer flex flex-col">
                          <a
                            href={`/hr/hiring/viewApplication?userId=${employee._id}`}
                          >
                            View Application
                          </a>
                          <span className="text-sm text-gray-500">
                            {employee.status}
                          </span>
                        </div>
                      </TableCell>
                      {/* Button to approve or reject the application */}
                      <TableCell className="text-left">
                        <div className="flex flex-row gap-2">
                          <Button
                            onClick={() => {
                              handleApproveApplication(employee._id);
                            }}
                            className="bg-blue-500 text-white hover:bg-green-500 cursor-pointer"
                          >
                            <span>Approve</span>
                          </Button>
                          <Button
                            onClick={() => {
                              handleRejectApplication(employee._id);
                            }}
                            className="bg-white text-black cursor-pointer border hover:bg-red-500 border-gray-300"
                          >
                            <span>Reject</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        )}
      </div>
      {/* Show Reject Window */}
      {isRejecting && (
        <Card>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
              {/* If click the X button, close the window, reset the state */}
              <button
                onClick={() => {
                  setIsRejecting(false);
                  setCurrentUserId(null);
                  setRejectionFeedback("");
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5 hover:cursor-pointer" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Reject Application</h2>
              <label className="block mb-2 text-sm font-medium">Feedback</label>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={4}
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="Enter reason for rejection..."
              />
              <div className="flex justify-end gap-4">
                <Button
                  className="bg-red-600 text-white hover:bg-red-400"
                  onClick={handleConfirmReject}
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 text-sm text-gray-600">
        <div className="mb-2 md:mb-0">
          Showing{" "}
          <span className="font-semibold">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
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

          {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
            (page, index) => {
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
                    className={`w-8 h-8 border rounded-md flex items-center justify-center ${
                      isCurrent
                        ? "bg-blue-600 text-white font-bold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              } else if (
                (page === table.getState().pagination.pageIndex - 2 &&
                  page !== 0 + 1) ||
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
            }
          )}

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
};

export default OnboardingPage;
