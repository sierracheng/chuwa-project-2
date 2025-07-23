// TODO: add api function here

import { createRegistrationTokenAPI } from "./registrationTokenAPI";

async function testCreateRegistrationTokenAPI(from: string, email: string) {
  try {
    const response = await createRegistrationTokenAPI(from, email);
    console.log(response);
  } catch (error) {
    console.error("Error creating registration token:", error);
  }
}

function main() {
  testCreateRegistrationTokenAPI(
    "zhaoyq0429@gmail.com",
    "zgeming@seas.upenn.edu"
  );
}

main();
