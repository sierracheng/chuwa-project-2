import { CREATE_SIMPLE_USER_MUTATION } from "../mutations/User";

export async function createSimpleUserAPI(input: {
    token: string;
    username: string;
    password: string;
    email: string;
}) {
    const response = await fetch("http://localhost:3004/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: CREATE_SIMPLE_USER_MUTATION,
            variables: { input },
        }),
    });
    const data = await response.json();
    if (data.errors) {
        console.error("Error creating user:", data.errors);
        return { success: false, message: "Failed to create user" };
    }
    return data;
};
