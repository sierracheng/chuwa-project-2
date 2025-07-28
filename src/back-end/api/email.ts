export async function sendEmailAPI(to: string, subject: string, text: string, html: string) {
  const res = await fetch("http://localhost:3004/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, subject, text, html }),
  });

  if (!res.ok) {
    throw new Error("Failed to send email");
  }

  return res.json();
}