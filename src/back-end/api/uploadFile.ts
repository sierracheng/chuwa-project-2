import axios from "axios";

export async function uploadFile(file: File) {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  try {
    const response = await axios.post("http://localhost:3004/upload", {
      file: base64,
      fileName: file.name,
    });
    return response.data.url;
  } catch (error) {
    console.error("Upload error:", error);
  }
}
