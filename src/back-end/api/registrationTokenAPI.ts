import axios from "axios";

export async function createRegistrationTokenAPI(from: string, email: string) {
  try {
    const response = await axios.post(
      "http://localhost:3004/registration-token",
      { from, email }
    );
    console.log(
      "Registration token created:",
      response.data,
      "Email successfully send from: ",
      from,
      "to: ",
      email
    );
    return response.data;
  } catch (error) {
    console.error("Error creating registration token:", error);
    return { success: false, message: "Failed to create registration token" };
  }
}
