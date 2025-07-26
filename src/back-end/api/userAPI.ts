import { CREATE_SIMPLE_USER_MUTATION } from "../mutations/User";
import { FIND_USER_MUTATION } from "../mutations/User";


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
    console.log("Response from createSimpleUserAPI:", data);
    if (data.errors) {
        console.error("Error creating user:", data.errors);
        return { success: false, message: "Failed to create user" };
    }
    return {
        success: true,
        message: "User created successfully",
        data: data.data.createSimpleUser,
    };
};

export async function findUserAPI(input: {
    username: string
    password: string
}) {

    const response = await fetch("http://localhost:3004/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: FIND_USER_MUTATION,
            variables: { input },
        }),
    })

    const data = await response.json()

    if (data.errors) {
        console.error("Error finding user:", data.errors)
        return { success: false, message: "Failed to find user" }
    }

    return data.data.findUser
}

export async function findUserVisaTypeAPI(input: {
    id: string
}) {
    const url = `http://localhost:3004/${input.id}/visa-type`;
    // console.log('Making request to URL:', url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Raw response data:', data);

    if (!data.success) {
        console.error("Error finding user visa type:", data.error);
        return { success: false, message: data.message || "Failed to find user visa type" };
    }

    return data;
}

export async function getUserDataAPI(id: string) {
    try {
        const response = await fetch(`http://localhost:3004/getUserData/${id}`);
        const data = await response.json();

        if (!data.success) {
            console.error("Failed to fetch user data:", data.message);
            return null;
        }

        return data.data;
    } catch (err) {
        console.error("API error:", err);
        return null;
    }
}

export async function getUserNameAndAvatarByIdAPI(id: string) {
    try {
        const response = await fetch(`http://localhost:3004/getUserNameAndAvatar/${id}`);
        const data = await response.json();

        if (!data.success) {
            console.error("Failed to fetch user name and avatar:", data.message);
            return null;
        }

        return data.data;
    } catch (err) {
        console.error("API error:", err);
        return null;
    }
}