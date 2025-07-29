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
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const OnboardingPage = () => {
  // Local State
  const [employees, setEmployees] = useState<
    {
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
    }[]
  >([]);
  const [isRejecting, setIsRejecting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Initial fetch of employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getEmployeesDataAPI();
      const newEmployees = await Promise.all(
        employees.map(async (employee: { _id: string }) => {
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
            return employee;
          }
        })
      );
      setEmployees(newEmployees);
    };

    fetchEmployees();
  }, []);

  // Handle approve application
  const handleApproveApplication = async (userId: string) => {
    console.log("Approve application for user:", userId);
    try {
      const response = await updateOnboardingStatusAPI(userId, "approved");
      console.log(response);
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
          <Input placeholder="Search by name..." className="max-w-sm" />
        </div>
      </div>
      {/* All and Three Status Buttons */}
      <div className="flex flex-row items-center gap-8 mb-4">
        <Button
          className="bg-gray-600 text-white hover:bg-gray-300 cursor-pointer"
          onClick={() => setSelectedStatus(null)}
        >
          <span>All</span>
        </Button>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-300 cursor-pointer"
          onClick={() => setSelectedStatus("pending")}
        >
          <span>Pending</span>
        </Button>
        <Button
          className="bg-red-600 text-white hover:bg-red-300 cursor-pointer"
          onClick={() => setSelectedStatus("rejected")}
        >
          <span>Rejected</span>
        </Button>
        <Button
          className="bg-green-600 text-white hover:bg-green-300 cursor-pointer"
          onClick={() => setSelectedStatus("approved")}
        >
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
            {employees
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
                      {employee.realName.firstName} {employee.realName.lastName}
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
                      <a href={`/onboarding/${employee._id}`}>
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
    </div>
  );
};

export default OnboardingPage;
