import API_BASE_URL from "./api";

export async function uploadVehicleImage(image, status) {

    const formData = new FormData();

    formData.append("image", image);

    formData.append("status", status);

    try {

        const response = await fetch(
            `${API_BASE_URL}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Image upload failed.");
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        throw error;

    }

}