const IMAGE_SERVICE_URL = "http://localhost:8081";
const CONVERSION_SERVICE_URL = "http://localhost:8082";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${IMAGE_SERVICE_URL}/api/images/upload`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Upload failed");
  }

  return json.data; // { imageId, url }
}

export async function resizeImage({ imageId, width, height, unit, dpi }) {
  const res = await fetch(`${CONVERSION_SERVICE_URL}/api/convert/resize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId, width, height, unit, dpi }),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Conversion failed";
    try {
      message = JSON.parse(text).message || message;
    } catch {
      // ignore parse error, use default message
    }
    throw new Error(message);
  }

  return res.json(); // { fileName, downloadUrl, widthInPx, heightInPx }
}
