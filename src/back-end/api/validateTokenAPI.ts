export async function validateTokenAPI(token: string): Promise<boolean> {
    try {
        const res = await fetch("http://localhost:3004/api/validate-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();
        return data.valid;
    } catch (err) {
        console.error("Validation failed", err);
        return false;
    }
}
