import { useForm } from "react-hook-form";

export const useOnboardingForm = () =>
  useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      preferredName: "",
      profilePicture: null,
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
        optReceipt: null,
        otherVisaTitle: "",
        documents: [],
      },
      reference: {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
      emergencyContacts: [
        {
          firstName: "",
          lastName: "",
          middleName: "",
          phone: "",
          email: "",
          relationship: "",
        },
      ],
      documents: {
        profilePicture: null,
        driverLicense: null,
        workAuth: null,
      },
    },
  });
