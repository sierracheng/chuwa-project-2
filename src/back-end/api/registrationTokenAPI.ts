import axios from "axios";

/**
 * Create a new registration token
 * This is only for HR to create a new registration token
 * After HR add the potential employee, HR will send the registration token to the employee
 */
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

/**
 * Add a new employee to the database
 * This is only for HR to add a new employee to the database
 * After add the potential employee, HR will send the registration token to the employee
 */
export async function createEmployeeAPI(
  firstName: string,
  lastName: string,
  email: string
) {
  try {
    const response = await axios.post(
      "http://localhost:3004/registration-token/create-employee",
      { firstName, lastName, email }
    );
    return {
      success: true,
      message: "Employee added successfully",
      employee: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return { success: false, message: error.response.data.message };
  }
}

/**
 * Get all employees from the database
 * This is only for HR to get all employees from the database
 * This is used to send the registration token to the employee
 */
export async function getAllEmployeesAPI() {
  try {
    const response = await axios.get(
      "http://localhost:3004/registration-token/employees"
    );
    return response.data;
  } catch (error) {
    console.error("Error getting all employees:", error);
    return { success: false, message: "Failed to get all employees" };
  }
}
