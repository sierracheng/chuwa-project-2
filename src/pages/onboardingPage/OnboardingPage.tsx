import {
  createOnboardingApplicationAPI,
  getOnboardingStatusAPI,
  updateAllOnboardingApplicationAPI,
} from "@/back-end/api/onboardingAPI";
import type { GenderType, VisaTypeUnion } from "@/back-end/models/Types";
import Background from "@/components/Background";
import { Card } from "@/components/Card/Card";
import {
  formSchema,
  resetForm,
  useOnboardingForm,
} from "@/utils/onboardingForm";
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
import { uploadFile } from "@/back-end/api/uploadFile";
import type z from "zod";
import { useNavigate } from "react-router-dom";
import { fetchFile } from "@/back-end/api/fetchFile";

/**
 * TODO:
 * 1. Only employee can access this page
 * 2. When employee first time login to the system, he needs to create his information
 * 3. Get this user's onboarding status from database
 * 4. If the onboarding status is "pending", show the onboarding form
 * 5. If the onboarding status is "approved", redirect to the employee homepage
 * 6. If the onboarding status is "rejected", show the onboarding form with the previous data and HR feedback
 */
export function OnboardingPage() {
  // Navigate
  const navigate = useNavigate();

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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  // Local State
  // HR Feedback
  const [hrFeedback, setHrFeedback] = useState<string | null>(null);

  // File upload
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [optReceiptFile, setOptReceiptFile] = useState<File | null>(null);

  // Submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user id from local storage
  const userId = localStorage.getItem("userId") || "6883e8c0764c51eb6f2d6b00"; // For testing id

  // Try get the onboarding status from database
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      console.log("Fetching onboarding status...");
      const status = await getOnboardingStatusAPI(userId);
      console.log("Successfully fetched onboarding status:", status);
      setOnboardingStatus(status);
      // If the onboarding status is "approved", redirect to the employee homepage
      if (onboardingStatus === "approved") {
        navigate("/employee/homepage");
      }
      // If the onboarding status is "rejected", show the onboarding form with the previous data and HR feedback
      else if (
        onboardingStatus === "rejected" ||
        onboardingStatus === "pending"
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

        // Fetch the file from the URL
        const optFile = await fetchFile(
          onboardingData.documents.workAuthorizationUrl
        );
        form.setValue("workAuth.optReceipt", new File([optFile], "opt.pdf"));
        setOptReceiptFile(new File([optFile], "opt.pdf"));

        // Fetch driver license
        const driverLicenseFile = await fetchFile(
          onboardingData.documents.driverLicenseUrl
        );
        setDriverLicenseFile(
          new File([driverLicenseFile], "driver-license.pdf")
        );
        form.setValue(
          "documents.driverLicense",
          new File([driverLicenseFile], "driver-license.pdf")
        );
      }
    };
    fetchOnboardingStatus();
  }, [form, navigate, onboardingStatus, userId]);

  // Handle file upload
  const handleUpload = async (file: File) => {
    console.log("Uploading file now!!!!!!:", file);
    const result = await uploadFile(file);
    console.log("Successfully uploaded file URL:", result);
    return result;
  };

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
    <main className="flex flex-col w-full text-2xl relative min-h-screen overflow-hidden">
      {/* Chuwa background img */}
      <div className="inset-0">
        <Background />
      </div>

      {/* Form goes here: */}
      <div className="relative z-10 flex min-h-screen items-center justify-center py-10">
        {isSubmitting ? (
          <div className="text-2xl font-semibold text-center text-white mb-6">
            Submitting...
          </div>
        ) : (
          <Card className="w-full !max-w-4xl flex flex-col items-center justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  async (data: z.infer<typeof formSchema>) => {
                    // Set isSubmitting to true
                    setIsSubmitting(true);
                    try {
                      // TODO: Handle file upload
                      const driverLicense = await handleUpload(
                        driverLicenseFile || new File([], "")
                      );
                      const optReceipt = await handleUpload(
                        optReceiptFile || new File([], "")
                      );
                      const profile = await handleUpload(
                        profileFile || new File([], "")
                      );

                      const payload = {
                        userId,
                        status: "pending",
                        feedback: hrFeedback || "",
                        realName: {
                          firstName: data.firstName,
                          lastName: data.lastName,
                          middleName: data.middleName,
                          preferredName: data.preferredName,
                        },
                        ssn: data.ssn,
                        dateOfBirth: new Date(data.dob),
                        gender: data.gender as GenderType,
                        address: data.address,
                        contactInfo: {
                          cellPhone: data.cellPhone,
                          workPhone: data.workPhone,
                          email: data.email,
                        },
                        emergencyContact: {
                          realName: {
                            firstName: data.emergencyContacts?.[0].firstName,
                            lastName: data.emergencyContacts?.[0].lastName,
                            middleName: data.emergencyContacts?.[0].middleName,
                          },
                          contactInfo: {
                            cellPhone: data.emergencyContacts?.[0].cellPhone,
                            workPhone: data.emergencyContacts?.[0].workPhone,
                            email: data.emergencyContacts?.[0].email,
                          },
                          relationship:
                            data.emergencyContacts?.[0].relationship,
                        },
                        employment: {
                          visaTitle: data.workAuth.type as VisaTypeUnion,
                          startDate: new Date(data.workAuth.startDate),
                          endDate: new Date(data.workAuth.endDate),
                          daysRemaining:
                            new Date(data.workAuth.endDate).getTime() -
                            new Date().getTime(),
                        },
                        documents: {
                          profilePictureUrl: profile,
                          driverLicenseUrl: driverLicense,
                          workAuthorizationUrl: optReceipt,
                        },
                        reference: {
                          realName: {
                            firstName: data.reference.firstName,
                            lastName: data.reference.lastName,
                            middleName: data.reference.middleName,
                          },
                          contactInfo: {
                            cellPhone: data.reference.cellPhone,
                            workPhone: data.reference.workPhone,
                            email: data.reference.email,
                          },
                        },
                      };
                      // If the onboarding status is "pending" or "rejected", update the onboarding application
                      if (
                        onboardingStatus === "pending" ||
                        onboardingStatus === "rejected"
                      ) {
                        const res = await updateAllOnboardingApplicationAPI(
                          payload
                        );
                        console.log("Success:", res);
                        alert("Application updated successfully!");
                        // Reload the page
                        window.location.reload();
                      } else {
                        const res = await createOnboardingApplicationAPI(
                          payload
                        );
                        console.log("Success:", res);
                        alert("Application submitted successfully!");
                        // Reload the page
                        window.location.reload();
                      }
                    } catch (err) {
                      console.error("Failed to submit:", err);
                      alert("Submission failed. Please try again.");
                    } finally {
                      // Set isSubmitting to false
                      setIsSubmitting(false);
                    }
                  }
                )}
                className="flex flex-col space-y-8 w-full max-w-3xl py-6 px-4"
              >
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
                    <a href={URL.createObjectURL(profileFile)} download>
                      {profileFile.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileFile(null);
                        setProfilePreview(null);
                      }}
                      className="text-red-600 underline text-sm w-fit"
                    >
                      Delete
                    </button>
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
                  <option value="PreferNotToSay">
                    I do not wish to answer
                  </option>
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
                        <a href={URL.createObjectURL(optReceiptFile)} download>
                          {optReceiptFile.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => setOptReceiptFile(null)}
                          className="text-red-600 underline text-sm w-fit"
                        >
                          Delete
                        </button>
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
                    {/* If there is only one emergency contact, don't show the delete button */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 underline text-sm w-fit"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    append({
                      firstName: "",
                      lastName: "",
                      middleName: "",
                      cellPhone: "",
                      workPhone: "",
                      email: "",
                      relationship: "",
                    })
                  }
                  className="flex text-sm"
                >
                  + Add Emergency Contact
                </button>

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
                {/* Allow user to delete the file */}
                {driverLicenseFile && (
                  <div className="text-sm underline text-blue-500 flex justify-start gap-2">
                    <a href={URL.createObjectURL(driverLicenseFile)} download>
                      {driverLicenseFile.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => setDriverLicenseFile(null)}
                      className="text-red-600 underline text-sm w-fit"
                    >
                      Delete
                    </button>
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

                {/* User have uploaded the work authorization file, show the file itself, this file canbe downloaded */}
                {/* Allow user to delete the file */}
                {optReceiptFile && (
                  <div className="text-sm underline text-blue-500 flex justify-start gap-2">
                    <a href={URL.createObjectURL(optReceiptFile)} download>
                      {optReceiptFile.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => setOptReceiptFile(null)}
                      className="text-red-600 underline text-sm w-fit"
                    >
                      Delete
                    </button>
                  </div>
                )}
                {/* Button will be disabled if onboarding status is "pending" */}
                {onboardingStatus === "pending" && (
                  <div className="text-sm  text-red-500 flex justify-center gap-2">
                    <p>Please wait for HR to review your application!</p>
                  </div>
                )}
                {onboardingStatus !== "pending" && (
                  <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                )}
              </form>
            </Form>
          </Card>
        )}
      </div>
    </main>
  );
}
