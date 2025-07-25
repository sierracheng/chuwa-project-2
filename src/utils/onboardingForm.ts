import { useForm } from "react-hook-form";
import { z } from "zod";
import { SSN_REGEX } from "./util";
import { zodResolver } from "@hookform/resolvers/zod";

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
