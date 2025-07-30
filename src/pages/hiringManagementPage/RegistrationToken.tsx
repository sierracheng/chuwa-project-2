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
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Card } from "@/components/Card/Card";
import {
  createEmployeeAPI,
  createRegistrationTokenAPI,
  getAllEmployeesAPI,
} from "@/back-end/api/registrationTokenAPI";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { validateTokenAPI } from "@/back-end/api/validateTokenAPI";

type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  link: string;
  status: string;
};

// Define table columns
const columns: ColumnDef<Employee>[] = [
  {
    header: "Employee",
    id: "fullName",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Token",
    accessorKey: "token",
  },
  {
    header: "Register Link",
    accessorKey: "link",
  },
];

const RegistrationToken = () => {
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [error, setError] = useState<string>("");
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(
    new Set()
  );
  const [countdown, setCountdown] = useState<Record<string, number>>({});

  // Fetch employees initially
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      const rawEmployees = await getAllEmployeesAPI();

      const updatedEmployees = await Promise.all(
        rawEmployees.employees.map(async (employee: Employee) => {
          try {
            const link = employee.link;
            const parsedUrl = new URL(link);
            const token = parsedUrl.searchParams.get("token");
            const isValid = await validateTokenAPI(token || "");
            return isValid ? employee : { ...employee, token: "", link: "" };
          } catch (err) {
            console.log(err);
            return { ...employee, token: "", link: "" };
          }
        })
      );

      setAllEmployees(updatedEmployees);
      setIsLoading(false);
    };

    fetchEmployees();
  }, []);

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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const fullName =
        `${row.original.firstName} ${row.original.lastName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  });

  // Add Employee form
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleAddEmployee = async (
    firstName: string,
    lastName: string,
    email: string
  ) => {
    try {
      const response = await createEmployeeAPI(firstName, lastName, email);
      if (response.success) {
        setShowAddEmployee(false);
        window.location.reload();
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddingEmployee(false);
    }
  };

  const handleGenerateToken = async (email: string) => {
    const HREmail = "akiko948436464@gmail.com";
    setDisabledButtons((prev) => new Set(prev).add(email));
    setCountdown((prev) => ({ ...prev, [email]: 5 }));

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown((prev) => ({ ...prev, [email]: count }));
      if (count <= 0) {
        clearInterval(interval);
        setDisabledButtons((prev) => {
          const updated = new Set(prev);
          updated.delete(email);
          return updated;
        });
        setCountdown((prev) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [email]: _, ...rest } = prev;
          return rest;
        });
        window.location.reload();
      }
    }, 1000);

    try {
      const response = await createRegistrationTokenAPI(HREmail, email);
      if (response.success) {
        console.log("Token generated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full relative">
      {/* Search + Add Bar */}
      <div className="flex items-center justify-between py-4 mb-4">
        <div className="flex flex-row items-center gap-4 mb-6 w-full max-w-2xl">
          <Input
            placeholder="Search by name..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="bg-blue-600 text-white hover:bg-blue-300 cursor-pointer"
            onClick={() => setShowAddEmployee(true)}
          >
            Add Employee
          </Button>
        </div>
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
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Token</TableHead>
                <TableHead className="text-left">Register Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(({ original: employee }) => (
                <TableRow key={employee._id}>
                  <TableCell className="text-left">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-col">
                      <span>{employee.email}</span>
                      <span className="text-sm text-gray-500">
                        {employee.token
                          ? "Token was sent"
                          : "No token sent or expired"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">{employee.status}</TableCell>
                  <TableCell className="text-left">
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleGenerateToken(employee.email)}
                      disabled={
                        disabledButtons.has(employee.email) ||
                        employee.status === "Submitted"
                      }
                    >
                      Generate Token and Send Email
                      {disabledButtons.has(employee.email) &&
                        countdown[employee.email] !== undefined && (
                          <span className="ml-2 text-sm">
                            ({countdown[employee.email]})
                          </span>
                        )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-left">
                    {employee.link ? (
                      <a
                        href={employee.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {employee.link.slice(0, 50)}...
                      </a>
                    ) : (
                      "Not yet sent or expired"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <Card>
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
              <button
                onClick={() => {
                  setShowAddEmployee(false);
                  setError("");
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5 hover:cursor-pointer" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
              <Input
                required
                placeholder="First Name"
                className="mb-2"
                value={employeeForm.firstName}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    firstName: e.target.value,
                  })
                }
              />
              <Input
                required
                placeholder="Last Name"
                className="mb-2"
                value={employeeForm.lastName}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, lastName: e.target.value })
                }
              />
              <Input
                required
                placeholder="Email"
                className="mb-4"
                value={employeeForm.email}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, email: e.target.value })
                }
              />
              {error && <p className="text-red-500">{error}</p>}
              <Button
                disabled={isAddingEmployee}
                onClick={() => {
                  setIsAddingEmployee(true);
                  handleAddEmployee(
                    employeeForm.firstName,
                    employeeForm.lastName,
                    employeeForm.email
                  );
                }}
              >
                {isAddingEmployee ? "Adding..." : "Save"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistrationToken;
