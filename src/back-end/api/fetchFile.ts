import axios from "axios";

export async function fetchFile(url: string) {
  try {
    const response = await axios.get("http://localhost:3004/fetch", {
      params: {
        url,
      },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching from ImageKit:", error);
  }
}
