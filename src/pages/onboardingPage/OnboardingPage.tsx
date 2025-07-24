import { createOnboardingApplicationAPI } from "@/back-end/api/onboardingAPI";
import type { GenderType, VisaTypeUnion } from "@/back-end/models/Types";
import { useOnboardingForm } from "@/utils/onboardingForm";
import { useWatch, useFieldArray, FormProvider } from "react-hook-form";

export function OnboardingPage() {
  // Import form from utils
  const form = useOnboardingForm();

  const citizen = useWatch({ control: form.control, name: "citizen" });
  const workAuthType = useWatch({
    control: form.control,
    name: "workAuth.type",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  return (
    <main className="flex flex-col items-center w-full pl-12 py-8 text-2xl ">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            try {
              // Handle file upload later
              const driverLicense = "/";
              const workAuth = "/";
              const optReceipt = "/";

              // Get user id from local storage
              const userId =
                localStorage.getItem("userId") || "6881a662acb068b02a184fbb"; // For testing id

              const payload = {
                userId,
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
                    cellPhone: data.emergencyContacts?.[0].phone,
                    workPhone: data.emergencyContacts?.[0].phone,
                    email: data.emergencyContacts?.[0].email,
                  },
                  relationship: data.emergencyContacts?.[0].relationship,
                },
                employment: {
                  visaTitle: data.workAuth.type as VisaTypeUnion,
                  startDate: new Date(data.workAuth.startDate),
                  endDate: new Date(data.workAuth.endDate),
                  daysRemaining: 100,
                },
                documents: {
                  profilePictureUrl: "/",
                  driverLicenseUrl: driverLicense,
                  workAuthorizationUrl: workAuth || optReceipt,
                },
                reference: {
                  realName: {
                    firstName: data.reference.firstName,
                    lastName: data.reference.lastName,
                    middleName: data.reference.middleName,
                  },
                  contactInfo: {
                    cellPhone: data.reference.phone,
                    workPhone: data.reference.phone,
                    email: data.reference.email,
                  },
                },
              };

              const res = await createOnboardingApplicationAPI(payload);
              console.log("Success:", res);

              alert("Application submitted successfully!");
            } catch (err) {
              console.error("Failed to submit:", err);
              alert("Submission failed. Please try again.");
            }
          })}
          className="flex flex-col space-y-6 w-full max-w-3xl border border-gray-900 rounded-md p-4"
        >
          <h2 className="text-xl font-bold">Personal Information</h2>
          <input
            required
            {...form.register("firstName")}
            placeholder="First Name"
          />
          <input
            required
            {...form.register("lastName")}
            placeholder="Last Name"
          />
          <input {...form.register("middleName")} placeholder="Middle Name" />
          <input
            {...form.register("preferredName")}
            placeholder="Preferred Name"
          />

          <label>Profile Picture</label>
          <input type="file" {...form.register("profilePicture")} />

          <h2 className="text-xl font-bold">Address</h2>
          <input {...form.register("address.street")} placeholder="Street" />
          <input
            {...form.register("address.building")}
            placeholder="Building/Apt #"
          />
          <input {...form.register("address.city")} placeholder="City" />
          <input {...form.register("address.state")} placeholder="State" />
          <input {...form.register("address.zip")} placeholder="Zip Code" />

          <h2 className="text-xl font-bold">Contact</h2>
          <input {...form.register("cellPhone")} placeholder="Cell Phone" />
          <input {...form.register("workPhone")} placeholder="Work Phone" />
          <input {...form.register("email")} placeholder="Email" />

          <input required {...form.register("ssn")} placeholder="SSN" />
          <input
            required
            type="date"
            {...form.register("dob")}
            placeholder="Date of Birth"
          />

          <select {...form.register("gender")} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="PreferNotToSay">I do not wish to answer</option>
          </select>

          <label>Are you a permanent resident or citizen of the U.S.?</label>
          <select {...form.register("citizen")} required>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          {citizen === "yes" && (
            <select {...form.register("workAuth.type")} required>
              <option value="">Select</option>
              <option value="GreenCard">Green Card</option>
              <option value="Citizen">Citizen</option>
            </select>
          )}

          {citizen === "no" && (
            <>
              <label>What is your work authorization?</label>
              <select {...form.register("workAuth.type")} required>
                <option value="">Select</option>
                <option value="H1B">H1-B</option>
                <option value="L2">L2</option>
                <option value="F1">F1 (CPT/OPT)</option>
                <option value="H4">H4</option>
                <option value="Other">Other</option>
              </select>
              {workAuthType === "F1" && (
                <input
                  type="file"
                  {...form.register("workAuth.optReceipt")}
                  placeholder="Upload OPT Receipt"
                />
              )}
              {workAuthType === "Other" && (
                <input
                  {...form.register("workAuth.otherVisaTitle")}
                  placeholder="Enter visa title"
                />
              )}
              <input
                type="date"
                {...form.register("workAuth.startDate")}
                placeholder="Start Date"
                required
              />
              <input
                type="date"
                {...form.register("workAuth.endDate")}
                placeholder="End Date"
                required
              />
            </>
          )}

          <h2 className="text-xl font-bold">Who referred you to us?</h2>
          <input
            {...form.register("reference.firstName")}
            placeholder="First Name"
            required
          />
          <input
            {...form.register("reference.lastName")}
            placeholder="Last Name"
            required
          />
          <input
            {...form.register("reference.middleName")}
            placeholder="Middle Name"
          />
          <input
            {...form.register("reference.phone")}
            placeholder="Phone"
            required
          />
          <input
            {...form.register("reference.email")}
            placeholder="Email"
            required
          />
          <input
            {...form.register("reference.relationship")}
            placeholder="Relationship"
            required
          />

          <h2 className="text-xl font-bold">Emergency Contacts</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col space-y-2 border p-2">
              <input
                {...form.register(`emergencyContacts.${index}.firstName`)}
                placeholder="First Name"
                required
              />
              <input
                {...form.register(`emergencyContacts.${index}.lastName`)}
                placeholder="Last Name"
                required
              />
              <input
                {...form.register(`emergencyContacts.${index}.middleName`)}
                placeholder="Middle Name"
              />
              <input
                {...form.register(`emergencyContacts.${index}.phone`)}
                placeholder="Phone"
                required
              />
              <input
                {...form.register(`emergencyContacts.${index}.email`)}
                placeholder="Email"
                required
              />
              <input
                {...form.register(`emergencyContacts.${index}.relationship`)}
                placeholder="Relationship"
                required
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 underline text-sm w-fit"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                firstName: "",
                lastName: "",
                middleName: "",
                phone: "",
                email: "",
                relationship: "",
              })
            }
          >
            + Add Emergency Contact
          </button>

          <h2 className="text-xl font-bold">Documents Summary</h2>
          <label>Driver's License</label>
          <input type="file" {...form.register("documents.driverLicense")} />

          <label>Work Authorization</label>
          <input type="file" {...form.register("documents.workAuth")} />

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </main>
  );
}
