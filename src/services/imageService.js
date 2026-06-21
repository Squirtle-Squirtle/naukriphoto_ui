const IMAGE_SERVICE_URL = "http://localhost:8081";
const CONVERSION_SERVICE_URL = "http://localhost:8082";

/**
 * Uploads a raw image file to the image service.
 * Returns { imageId, url }.
 */
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

/**
 * Sends a resize request to the conversion service.
 * `payload` shape: { imageId, width, height, unit, dpi }
 * Returns { fileName, downloadUrl, widthInPx, heightInPx }.
 */
export async function resizeImage(payload) {
  const res = await fetch(`${CONVERSION_SERVICE_URL}/api/convert/resize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Conversion failed";
    try {
      message = JSON.parse(text).message || message;
    } catch {
      // use default message if parse fails
    }
    throw new Error(message);
  }

  return res.json(); // { fileName, downloadUrl, widthInPx, heightInPx }
}
