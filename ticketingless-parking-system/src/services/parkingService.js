import API_BASE_URL from "./api";

export async function getParkingSession(licensePlate) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/parking/${licensePlate}`
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