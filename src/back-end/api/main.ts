// TODO: add api function here
import { findUserVisaTypeAPI, getUserNameAndAvatarByIdAPI } from "./userAPI";
import { createRegistrationTokenAPI } from "./registrationTokenAPI";
import { validateTokenAPI } from "./validateTokenAPI";
import {
  getOnboardingApplicationAPI,
  getOnboardingStatusAPI,
  getUserDocumentObjectAPI,
} from "./onboardingAPI";
import { getVisaStatusAPI } from "./visaStepsAPI";

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

async function testGetOnboardingApplicationAPI(userId: string) {
  try {
    const response = await getOnboardingApplicationAPI(userId);
    console.log("Response from getOnboardingApplicationAPI:", response);
  } catch (error) {
    console.error("Error getting onboarding application:", error);
  }
}

async function testGetVisaStatusAPI(userId: string) {
  try {
    const response = await getVisaStatusAPI(userId);
    console.log("Response from getVisaStatusAPI:", response);
  } catch (error) {
    console.error("Error getting visa status:", error);
  }
}

async function testGetUserNameAndAvatarByIdAPI(id: string) {
  try {
    const response = await getUserNameAndAvatarByIdAPI(id);
    console.log("Response from getUserNameAndAvatarByIdAPI:", response);
  } catch (error) {
    console.error("Error getting user name and avatar by ID:", error);
  }
}

async function testGetOnboardingStatusAPI(userId: string) {
  try {
    const response = await getOnboardingStatusAPI(userId);
    console.log("Response from getOnboardingStatusAPI:", response);
  } catch (error) {
    console.error("Error getting onboarding status:", error);
  }
}

async function testGetUserDocumentObjectAPI(userId: string) {
  try {
    const response = await getUserDocumentObjectAPI(userId);
    console.log("Response from getUserDocumentObjectAPI:", response);
  } catch (error) {
    console.error("Error getting user document object:", error);
  }
}

function main() {
  testCreateRegistrationTokenAPI(
    "akiko948436464@gmail.com",
    "xcheng9@uw.edu",
    //   "zhaoyq0429@gmail.com",
    //   // "Test12Grace@gmail.com",
    //   "zgeming@seas.upenn.edu"
    //   //akiko948436464@gmail.com
    //   // "xinranncheng@gmail.com",
  );
  // testValidateTokenAPI(
  //   "7464b889991c37662977aed35a5e48266fbb3380c05af78ed1251e5b28e8ec78"
  // );
  // testfindUserVisaTypeAPI(
  //   "6881a662acb068b02a184fbb"
  // );
  // testGetOnboardingApplicationAPI("6883e8c0764c51eb6f2d6b00");
  // testGetVisaStatusAPI("6883e8c0764c51eb6f2d6b00");
  // testGetUserNameAndAvatarByIdAPI("6883e8c0764c51eb6f2d6b00");
  // testGetOnboardingStatusAPI("6882c6cd1018ff27670a593d");
  //testGetUserDocumentObjectAPI("6883e8c0764c51eb6f2d6b00");
}

main();
