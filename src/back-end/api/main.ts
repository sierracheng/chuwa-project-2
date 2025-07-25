// TODO: add api function here
import { findUserVisaTypeAPI } from "./userAPI";
import { createRegistrationTokenAPI } from "./registrationTokenAPI";
import { validateTokenAPI } from "./validateTokenAPI";
import test from "node:test";

async function testCreateRegistrationTokenAPI(from: string, email: string) {
  try {
    const response = await createRegistrationTokenAPI(from, email);
    console.log(response);
  } catch (error) {
    console.error("Error creating registration token:", error);
  }
}

async function testValidateTokenAPI(token: string) {
  try {
    const isValid = await validateTokenAPI(token);
    console.log(`Token ${token} is valid:`, isValid);
  } catch (error) {
    console.error("Error validating token:", error);
  }
}

async function testfindUserVisaTypeAPI(id: string) {
  try {
    const response = await findUserVisaTypeAPI({ id });
    console.log("Response from findUserVisaTypeAPI:", response);
  } catch (error) {
    console.error("Error finding user visa type:", error);
  }
}

function main() {
  testCreateRegistrationTokenAPI(
    "akiko948436464@gmail.com",
    // "zhaoyq0429@gmail.com"
    "Test12Grace@gmail.com"
    // "zgeming@seas.upenn.edu"
    //akiko948436464@gmail.com
  );
  // testValidateTokenAPI(
  //   "7464b889991c37662977aed35a5e48266fbb3380c05af78ed1251e5b28e8ec78"
  // );
  // testfindUserVisaTypeAPI(
  //   "6881a662acb068b02a184fbb"
  // );
  
}



main();
