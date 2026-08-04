import { useState } from "react";
import ImagePreview from "./ImagePreview";

import { uploadVehicleImage } from "../services/uploadService";
import { validateVehicleImage } from "../utils/validators";

function ImageUploader({ setReceipt }) {
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState("Entry");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (file) {
      setVehicleImage(file);

      // Clear previous messages
      setMessage("");
      setMessageType("");
    }
  }

  async function handleSubmit() {
    // Validate uploaded image
    const validationError = validateVehicleImage(vehicleImage);

    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      // Backend call (Sprint 2)
      await uploadVehicleImage(vehicleImage, vehicleStatus);

      // Temporary parking session
      const parkingReceipt = {
        licensePlate: "ABC123GP",
        status: vehicleStatus,
        entryTime: new Date().toLocaleString(),
        exitTime:
          vehicleStatus === "Exit"
            ? new Date().toLocaleString()
            : "--",
        duration:
          vehicleStatus === "Exit"
            ? "2 Hours"
            : "In Progress",
        fee:
          vehicleStatus === "Exit"
            ? "R20.00"
            : "R0.00",
      };

      // Update ReceiptCard
      setReceipt(parkingReceipt);

      setMessage("Vehicle processed successfully!");
      setMessageType("success");

      console.log(parkingReceipt);

      // Reset form
      setVehicleImage(null);
      setVehicleStatus("Entry");

    } catch (error) {
      console.error(error);

      setMessage("Unable to process the vehicle. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="upload" className="upload">
      <div className="upload-card">

        <h2>Upload Vehicle Image</h2>

        <p>
          Upload a clear image of your vehicle's licence plate to begin
          or end your parking session.
        </p>

        <br />

        <label htmlFor="vehicleImage">
          Choose Vehicle Image
        </label>

        <input
          id="vehicleImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <p className="selected-file">
          <strong>Selected Image:</strong>{" "}
          {vehicleImage
            ? vehicleImage.name
            : "No image selected"}
        </p>

        <ImagePreview image={vehicleImage} />

        <h3>Parking Status</h3>

        <div className="radio-group">

          <label>
            <input
              type="radio"
              value="Entry"
              checked={vehicleStatus === "Entry"}
              onChange={(e) => setVehicleStatus(e.target.value)}
            />
            Entry
          </label>

          <label>
            <input
              type="radio"
              value="Exit"
              checked={vehicleStatus === "Exit"}
              onChange={(e) => setVehicleStatus(e.target.value)}
            />
            Exit
          </label>

        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-content">
              <span className="spinner"></span>
              <span>Processing Vehicle...</span>
            </div>
          ) : (
            "Process Vehicle"
          )}
        </button>

      </div>
    </section>
  );
}

export default ImageUploader;