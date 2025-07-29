import { fetchFile } from "@/back-end/api/fetchFile";
import { getUserDocumentObjectAPI } from "@/back-end/api/onboardingAPI";
import { getEmployeesDataAPI } from "@/back-end/api/userAPI";
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
import React, { useEffect, useState } from "react";

const OnboardingPage = () => {
  const [employees, setEmployees] = useState<
    {
      _id: string;
      realName: {
        firstName: string;
        lastName: string;
      };
      email: string;
      documents: {
        profilePicture: string;
      };
    }[]
  >([]);

  // Initial fetch of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getEmployeesDataAPI();
      const newEmployees = await Promise.all(
        employees.map(async (employee: { _id: string }) => {
          const documents = await getUserDocumentObjectAPI(employee._id);
          return {
            ...employee,
            documents,
          };
        })
      );
      setEmployees(newEmployees);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="w-full relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 mb-1 w-full">
        <div className="flex flex-row items-center gap-4 mb-1 w-full max-w-2xl">
          <Input placeholder="Search by name..." className="max-w-sm" />
        </div>
      </div>
      {/* Three Status Buttons */}
      <div className="flex flex-row items-center gap-8 mb-4">
        <Button className="bg-blue-600 text-white hover:bg-blue-300 cursor-pointer">
          <span>Pending</span>
        </Button>
        <Button className="bg-red-600 text-white hover:bg-red-300 cursor-pointer">
          <span>Rejected</span>
        </Button>
        <Button className="bg-green-600 text-white hover:bg-green-300 cursor-pointer">
          <span>Approved</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border w-full">
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
            {employees.map((employee) => (
              <TableRow
                key={employee._id}
                className="border-b-1 border-gray-300"
              >
                <TableCell className="text-left">
                  <div className="flex items-center gap-2">
                    <img
                      src={employee.documents.profilePicture}
                      alt="Profile Picture"
                      className="w-10 h-10 rounded-full"
                    />
                    {employee.realName.firstName} {employee.realName.lastName}
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex flex-col">
                    <span>{employee.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OnboardingPage;
