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
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/Card/Card";
import {
  createEmployeeAPI,
  createRegistrationTokenAPI,
  getAllEmployeesAPI,
  getTokenAPI,
} from "@/back-end/api/registrationTokenAPI";

const RegistrationToken = () => {
  // Local State
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [employees, setEmployees] = useState<
    {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      token: string;
    }[]
  >([]);
  const employeesRef = useRef(employees);
  const [error, setError] = useState<string>("");
  const [disabledButtons, setDisabledButtons] = useState<Set<string>>(
    new Set()
  );
  const [countdown, setCountdown] = useState<Record<string, number>>({});

  // Employee Form
  const [employeeForm, setEmployeeForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Update the employeesRef when the employees state changes
  useEffect(() => {
    employeesRef.current = employees;
  }, [employees]);

  // Initial fetch of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const rawEmployees = await getAllEmployeesAPI();
      const updatedEmployees = rawEmployees.employees;
      setEmployees(updatedEmployees);
    };

    fetchEmployees();
  }, []);

  // Fetch tokens
  useEffect(() => {
    const fetchTokenAndUpdate = async (email: string) => {
      const response = await getTokenAPI(email);
      if (response.success) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.email === email
              ? {
                  ...emp,
                  token: response.token,
                }
              : emp
          )
        );
      }
    };
    employeesRef.current.forEach((emp) => {
      fetchTokenAndUpdate(emp.email);
    });
  }, [employees]);

  // Add a new employee to the database
  const handleAddEmployee = async (
    firstName: string,
    lastName: string,
    email: string
  ) => {
    try {
      const response = await createEmployeeAPI(firstName, lastName, email);
      if (response.success) {
        console.log("Employee added successfully");
        setShowAddEmployee(false);
        window.location.reload();
      } else if (response.success === false) {
        console.log("Error adding employee");
        console.log(response);
        setError(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Generate a new token and send it to the employee
  const handleGenerateToken = async (email: string) => {
    const HREmail = "akiko948436464@gmail.com";

    // Disable the button immediately
    setDisabledButtons((prev) => new Set(prev).add(email));
    setCountdown((prev) => ({ ...prev, [email]: 5 }));

    // Start countdown
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
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 mb-4">
        <div className="flex flex-row items-center gap-4 mb-6 w-full max-w-2xl">
          <Input placeholder="Search by name..." className="max-w-sm" />
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Employee</TableHead>
              <TableHead className="text-left">Email</TableHead>
              <TableHead className="text-left">Token</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee._id}
                className="border-b-1 border-gray-300"
              >
                <TableCell className="text-left">
                  <div className="flex items-center gap-2">
                    {employee.firstName} {employee.lastName}
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex flex-col">
                    <span>{employee.email}</span>
                    <span className="text-sm text-gray-500">
                      {employee.token
                        ? "Token: " + employee.token
                        : "No token sent or expired"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={() => handleGenerateToken(employee.email)}
                    disabled={disabledButtons.has(employee.email)}
                  >
                    Generate Token and Send Email
                    {disabledButtons.has(employee.email) &&
                      countdown[employee.email] !== undefined && (
                        <span className="text-sm text-white">
                          ({countdown[employee.email]})
                        </span>
                      )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Floating Add Employee Card */}
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
              {/* Employee Form */}
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
                className="hover:cursor-pointer"
                onClick={() =>
                  handleAddEmployee(
                    employeeForm.firstName,
                    employeeForm.lastName,
                    employeeForm.email
                  )
                }
              >
                Save
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistrationToken;
