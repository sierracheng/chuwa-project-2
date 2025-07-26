import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOnboardingApplicationAPI } from "@/back-end/api/onboardingAPI";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resetForm = async (userId: string, form: any) => {
  const onboardingApplication = await getOnboardingApplicationAPI(userId);
  const userData = onboardingApplication.user;
  const onboardingData = onboardingApplication.onboardingApplication;

  // Reload data from database
  form.setValue("firstName", userData.realName.firstName);
  form.setValue("middleName", userData.realName.middleName);
  form.setValue("lastName", userData.realName.lastName);
  form.setValue("preferredName", userData.realName.preferredName);
  form.setValue("address.street", userData.address.street);
  form.setValue("address.building", userData.address.building);
  form.setValue("address.city", userData.address.city);
  form.setValue("address.state", userData.address.state);
  form.setValue("address.zip", userData.address.zip);
  form.setValue("cellPhone", userData.contactInfo.cellPhone);
  form.setValue("workPhone", userData.contactInfo.workPhone);
  form.setValue("email", userData.contactInfo.email);
  form.setValue("ssn", userData.ssn);
  const dobISO = userData.dateOfBirth;
  const dobDateOnly = dobISO.split("T")[0];
  form.setValue("dob", dobDateOnly);
  form.setValue("gender", userData.gender);
  const isCitizen =
    userData.employment.visaTitle === "Citizen" ||
    userData.employment.visaTitle === "Green Card"
      ? "yes"
      : "no";
  form.setValue("citizen", isCitizen);
  form.setValue("workAuth.type", userData.employment.visaTitle);
  form.setValue(
    "workAuth.startDate",
    userData.employment.startDate.split("T")[0]
  );
  form.setValue("workAuth.endDate", userData.employment.endDate.split("T")[0]);

  // Reference
  form.setValue(
    "reference.firstName",
    onboardingData.reference.realName.firstName
  );
  form.setValue(
    "reference.lastName",
    onboardingData.reference.realName.lastName
  );
  form.setValue(
    "reference.middleName",
    onboardingData.reference.realName.middleName
  );
  form.setValue(
    "reference.cellPhone",
    onboardingData.reference.contactInfo.cellPhone
  );
  form.setValue(
    "reference.workPhone",
    onboardingData.reference.contactInfo.workPhone
  );
  form.setValue("reference.email", onboardingData.reference.contactInfo.email);
  form.setValue(
    "emergencyContacts.0.firstName",
    userData.emergencyContact.realName.firstName
  );
  form.setValue(
    "emergencyContacts.0.lastName",
    userData.emergencyContact.realName.lastName
  );
  form.setValue(
    "emergencyContacts.0.middleName",
    userData.emergencyContact.realName.middleName
  );
  form.setValue(
    "emergencyContacts.0.cellPhone",
    userData.emergencyContact.contactInfo.cellPhone
  );
  form.setValue(
    "emergencyContacts.0.workPhone",
    userData.emergencyContact.contactInfo.workPhone
  );
  form.setValue(
    "emergencyContacts.0.email",
    userData.emergencyContact.contactInfo.email
  );
  form.setValue(
    "emergencyContacts.0.relationship",
    userData.emergencyContact.relationship
  );

  // Return the user data and onboarding data
  return {
    userData,
    onboardingData,
  };
};

export const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string(),
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Profile picture must be less than 5MB",
    }),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    building: z.string(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
  }),
  cellPhone: z.string().min(1, "Cell phone is required"),
  workPhone: z.string(),
  email: z.string(),
  ssn: z.string().min(1, "SSN is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  citizen: z.string().min(1, "Citizen is required"),
  workAuth: z.object({
    type: z.string().min(1, "Work authorization type is required"),
    startDate: z.string(),
    endDate: z.string(),
    optReceipt: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "OPT receipt must be less than 5MB",
      }),
    otherVisaTitle: z.string(),
  }),
  reference: z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string(),
    cellPhone: z.string(),
    workPhone: z.string(),
    email: z.string(),
  }),
  emergencyContacts: z.array(
    z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      middleName: z.string(),
      cellPhone: z.string().min(1, "Cell phone is required"),
      workPhone: z.string(),
      email: z.string(),
      relationship: z.string(),
    })
  ),
  documents: z.object({
    profilePicture: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Profile picture must be less than 5MB",
      }),
    driverLicense: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Driver license must be less than 5MB",
      }),
    workAuth: z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Work authorization must be less than 5MB",
      }),
  }),
});

export const useOnboardingForm = () =>
  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      preferredName: "",
      profilePicture: new File([], ""),
      address: {
        street: "",
        building: "",
        city: "",
        state: "",
        zip: "",
      },
      cellPhone: "",
      workPhone: "",
      email: "",
      ssn: "",
      dob: "",
      gender: "",
      citizen: "",
      workAuth: {
        type: "",
        startDate: "",
        endDate: "",
        optReceipt: new File([], ""),
        otherVisaTitle: "",
      },
      reference: {
        firstName: "",
        lastName: "",
        middleName: "",
        cellPhone: "",
        workPhone: "",
        email: "",
      },
      emergencyContacts: [
        {
          firstName: "",
          lastName: "",
          middleName: "",
          cellPhone: "",
          workPhone: "",
          email: "",
          relationship: "",
        },
      ],
      documents: {
        profilePicture: new File([], ""),
        driverLicense: new File([], ""),
        workAuth: new File([], ""),
      },
    },
  });
