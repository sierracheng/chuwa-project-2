export async function validateTokenAPI(token: string): Promise<boolean> {
    try {
        const res = await fetch("http://localhost:3004/validate-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const contentType = res.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON");
        }

        const data = await res.json();
        return !!data.email;
    } catch (err) {
        console.error("Validation failed", err);
        return false;
    }
}
