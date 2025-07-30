import {
  getOnboardingStatusAPI,
  updateOnboardingFeedbackAPI,
  updateOnboardingStatusAPI,
} from "@/back-end/api/onboardingAPI";
import { Card } from "@/components/Card/Card";
import { resetForm, useOnboardingForm } from "@/utils/onboardingForm";
import { useWatch, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchFile } from "@/back-end/api/fetchFile";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ViewApplicationPage() {
  // Navigate
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || "";

  // Form
  const form = useOnboardingForm();
  const citizen = useWatch({ control: form.control, name: "citizen" });
  const profilePicture = useWatch({
    control: form.control,
    name: "profilePicture",
  });
  const workAuthType = useWatch({
    control: form.control,
    name: "workAuth.type",
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  // Local State
  // HR Feedback
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [hrFeedback, setHrFeedback] = useState<string | null>(null);

  // File upload
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [optReceiptFile, setOptReceiptFile] = useState<File | null>(null);
  const [optReceiptUrl, setOptReceiptUrl] = useState<string | null>(null);
  const [driverLicenseUrl, setDriverLicenseUrl] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  // Submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle approve application
  const handleApproveApplication = async (userId: string) => {
    setIsSubmitting(true);
    console.log("Approve application for user:", userId);
    try {
      const response = await updateOnboardingStatusAPI(userId, "approved");
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error("Error handle approving application:", error);
    }
    setIsSubmitting(false);
  };

  // Handle reject application
  const handleRejectApplication = async (userId: string) => {
    setIsSubmitting(true);
    console.log("Reject application for user:", userId);
    setRejectionFeedback("");
    setIsRejecting(true);
    setIsSubmitting(false);
  };

  const handleConfirmReject = async () => {
    setIsSubmitting(true);
    if (userId) {
      try {
        const statusRes = await updateOnboardingStatusAPI(userId, "rejected");
        const feedbackRes = await updateOnboardingFeedbackAPI(
          userId,
          rejectionFeedback
        );

        console.log("Status Response:", statusRes);
        console.log("Feedback Response:", feedbackRes);

        // Reset the state
        setIsRejecting(false);
        setRejectionFeedback("");
        window.location.reload();
      } catch (error) {
        console.error("Error handle confirming reject:", error);
      }
    }
    setIsSubmitting(false);
  };

  // Try get the onboarding status from database
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      console.log("Fetching onboarding status...");
      const status = await getOnboardingStatusAPI(userId);
      console.log("Successfully fetched onboarding status:", status);
      setOnboardingStatus(status);
      // If the onboarding status is "rejected", show the onboarding form with the previous data and HR feedback
      if (
        onboardingStatus === "rejected" ||
        onboardingStatus === "pending" ||
        onboardingStatus === "approved"
      ) {
        // Reset the form
        const { onboardingData } = await resetForm(userId, form);

        // HR feedback
        setHrFeedback(onboardingData.feedback);

        // Fetch profile picture
        const profileFile = await fetchFile(
          onboardingData.documents.profilePictureUrl
        );
        setProfileFile(new File([profileFile], "profile.jpg"));
        form.setValue("profilePicture", new File([profileFile], "profile.jpg"));
        setProfileUrl(onboardingData.documents.profilePictureUrl);
        // Fetch the file from the URL
        const optFile = await fetchFile(
          onboardingData.documents.workAuthorizationUrl
        );
        form.setValue("workAuth.optReceipt", new File([optFile], "opt.pdf"));
        setOptReceiptFile(new File([optFile], "opt.pdf"));
        setOptReceiptUrl(onboardingData.documents.workAuthorizationUrl);

        // Fetch driver license
        const driverLicenseFile = await fetchFile(
          onboardingData.documents.driverLicenseUrl
        );
        setDriverLicenseFile(
          new File([driverLicenseFile], "driver-license.pdf")
        );
        setDriverLicenseUrl(onboardingData.documents.driverLicenseUrl);
        form.setValue(
          "documents.driverLicense",
          new File([driverLicenseFile], "driver-license.pdf")
        );
      }
    };
    fetchOnboardingStatus();
  }, [form, navigate, onboardingStatus, userId]);

  // Profile picture preview
  useEffect(() => {
    if (profilePicture instanceof File) {
      // Create a URL for the file:
      const url = URL.createObjectURL(profilePicture);
      // Set the URL to the state:
      setProfilePreview(url);
      // Revoke the URL when the component unmounts:
      return () => URL.revokeObjectURL(url);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

  return (
    <main className="flex flex-col w-full text-2xl relative min-h-screen overflow-hidden pl-12 py-8">
      {/* A X button that go to the previous page */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black hover:cursor-pointer"
      >
        <X className="w-5 h-5 hover:cursor-pointer" />
      </button>
      {/* Form goes here: */}
      <div className="relative z-10 flex min-h-screen items-center justify-center py-10">
        <Card className="w-full !max-w-4xl flex flex-col items-center justify-center">
          <Form {...form}>
            <form className="flex flex-col space-y-8 w-full max-w-3xl py-6 px-4">
              <h1 className="text-4xl font-semibold text-center text-gray-900 mb-16">
                Onboarding Application Form
              </h1>
              {hrFeedback && (
                <div className="text-red-500 text-center mb-6">
                  {hrFeedback}
                </div>
              )}
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Personal Information
              </h2>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Preferred Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Profile Picture
              </h2>
              {/* Done: Add a preview of the profile picture */}
              {profilePreview && profileFile && (
                <div className="mt-4">
                  <img
                    src={profilePreview}
                    alt="Profile Preview"
                    className="w-48 h-48 rounded-full object-cover border"
                  />
                </div>
              )}
              {!profileFile && (
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setProfileFile(file);
                            } else {
                              setProfileFile(null);
                            }
                          }}
                          className="flex text-sm hover:cursor-pointer border-2 border-gray-300 rounded-md p-2 w-fit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {profileFile && (
                <div className="text-sm underline text-blue-500 flex justify-start gap-2">
                  <a
                    href={profileUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {profileFile.name}
                  </a>
                </div>
              )}

              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Address
              </h2>
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street*</FormLabel>
                    <FormControl>
                      <Input placeholder="Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building/Apt #</FormLabel>
                    <FormControl>
                      <Input placeholder="Building/Apt #" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State*</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code*</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Contact
              </h2>
              <FormField
                control={form.control}
                name="cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Phone*</FormLabel>
                    <FormControl>
                      <Input placeholder="Cell Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Work Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSN*</FormLabel>
                    <FormControl>
                      <Input placeholder="SSN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth*</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Date of Birth"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <select {...form.register("gender")} className="flex text-sm">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="PreferNotToSay">I do not wish to answer</option>
              </select>

              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Are you a permanent resident or citizen of the U.S.?
              </h2>
              <select {...form.register("citizen")} className="flex text-sm">
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              {citizen === "yes" && (
                <select
                  {...form.register("workAuth.type")}
                  className="flex text-sm"
                >
                  <option value="">Select</option>
                  <option value="GreenCard">Green Card</option>
                  <option value="Citizen">Citizen</option>
                </select>
              )}

              {citizen === "no" && (
                <>
                  <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                    What is your work authorization?
                  </h2>
                  <select
                    {...form.register("workAuth.type")}
                    className="flex text-sm"
                  >
                    <option value="">Select</option>
                    <option value="H1B">H1-B</option>
                    <option value="L2">L2</option>
                    <option value="F1">F1 (CPT/OPT)</option>
                    <option value="H4">H4</option>
                    <option value="Other">Other</option>
                  </select>
                  {workAuthType === "F1" && !optReceiptFile && (
                    <FormField
                      control={form.control}
                      name="workAuth.optReceipt"
                      render={({ field: { onChange } }) => (
                        <FormItem>
                          <FormLabel>OPT Receipt</FormLabel>
                          <FormControl>
                            <input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                  setOptReceiptFile(file);
                                } else {
                                  setOptReceiptFile(null);
                                }
                              }}
                              className="flex text-sm hover:cursor-pointer border-2 border-gray-300 rounded-md p-2 w-fit"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {optReceiptFile && (
                    <div className="text-sm underline text-blue-500 flex justify-start gap-2">
                      <a
                        href={optReceiptUrl || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {optReceiptFile.name}
                      </a>
                    </div>
                  )}
                  {workAuthType === "Other" && (
                    <input
                      {...form.register("workAuth.otherVisaTitle")}
                      placeholder="Enter visa title"
                      className="flex text-sm"
                    />
                  )}
                  <input
                    type="date"
                    {...form.register("workAuth.startDate")}
                    placeholder="Start Date"
                    className="flex text-sm"
                  />
                  <input
                    type="date"
                    {...form.register("workAuth.endDate")}
                    placeholder="End Date"
                    className="flex text-sm"
                  />
                </>
              )}

              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Who referred you to us?
              </h2>
              <FormField
                control={form.control}
                name="reference.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference.cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Cell Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Must have at least one emergency contact */}
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Emergency Contacts
              </h2>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col space-y-8 border p-2"
                >
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.firstName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.lastName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.middleName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Middle Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.cellPhone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cell Phone*</FormLabel>
                        <FormControl>
                          <Input placeholder="Cell Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Input placeholder="Relationship" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                Documents Summary
              </h2>
              {/* User have uploaded the driver license file, show the file itself, this file canbe downloaded */}
              {!driverLicenseFile && (
                <FormField
                  control={form.control}
                  name="documents.driverLicense"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Driver's License</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setDriverLicenseFile(file);
                            } else {
                              setDriverLicenseFile(null);
                            }
                          }}
                          className="flex text-sm hover:cursor-pointer border-2 border-gray-300 rounded-md p-2 w-fit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* User have uploaded the driver license file, show the file itself, this file canbe downloaded */}
              {driverLicenseFile && (
                <div className="text-sm underline text-blue-500 flex justify-start gap-2">
                  <a
                    href={driverLicenseUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {driverLicenseFile.name}
                  </a>
                </div>
              )}

              {/* User have uploaded the work authorization file, show the file itself, this file canbe downloaded */}
              {!optReceiptFile && (
                <FormField
                  control={form.control}
                  name="documents.workAuth"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Work Authorization OPT Receipt</FormLabel>
                      <FormControl>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setOptReceiptFile(file);
                            } else {
                              setOptReceiptFile(null);
                            }
                          }}
                          className="flex text-sm hover:cursor-pointer border-2 border-gray-300 rounded-md p-2 w-fit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* User have uploaded the work authorization file, show the file itself, this file canbe previewed */}
              {optReceiptFile && (
                <div className="text-sm underline text-blue-500 flex justify-start gap-2">
                  <a
                    href={optReceiptUrl || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {optReceiptFile.name}
                  </a>
                </div>
              )}
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    console.log("Approve application");
                    handleApproveApplication(userId);
                  }}
                  className="bg-blue-500 text-white hover:bg-green-500 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Approve
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    console.log("Reject application");
                    handleRejectApplication(userId);
                  }}
                  className="bg-white text-black cursor-pointer border hover:bg-red-500 border-gray-300"
                  disabled={isSubmitting}
                >
                  Reject
                </Button>
              </div>
            </form>
          </Form>
          {/* Show Reject Window */}
          {isRejecting && (
            <Card>
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
                  {/* If click the X button, close the window, reset the state */}
                  <button
                    onClick={() => {
                      setIsRejecting(false);
                      setRejectionFeedback("");
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  >
                    <X className="w-5 h-5 hover:cursor-pointer" />
                  </button>
                  <h2 className="text-xl font-semibold mb-4">
                    Reject Application
                  </h2>
                  <label className="block mb-2 text-sm font-medium">
                    Feedback
                  </label>
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
        </Card>
      </div>
    </main>
  );
}
