import API_BASE_URL from "./api";

export async function getParkingSession(licensePlate) {

    const sanitized = encodeURIComponent(licensePlate.trim().toUpperCase());

    try {

        const response = await fetch(
            `${API_BASE_URL}/parking/${sanitized}`
        );

        if (!response.ok) {

            throw new Error("Parking session not found.");

        }

        return await response.json();

    } catch (error) {

        console.error(error);

        throw error;

    }

}