import API_BASE_URL from "./api";

export async function uploadVehicleImage(image, status) {

    const base64 = await toBase64(image);

    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, status })
    });

    if (!response.ok) throw new Error("Image upload failed.");

    return await response.json();
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}