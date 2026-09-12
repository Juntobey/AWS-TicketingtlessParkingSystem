import API_BASE_URL from "./api";

export async function uploadVehicleImage(image, status) {

    const base64 = await toJpegBase64(image);

    const response = await fetch(`${API_BASE_URL}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, status })
    });

    if (!response.ok) throw new Error("Image upload failed.");

    return await response.json();
}

function toJpegBase64(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", 0.9).split(",")[1]);
        };
        img.onerror = reject;
        img.src = url;
    });
}