import { useState } from "react";
import ImagePreview from "./ImagePreview";
import { uploadVehicleImage } from "../services/uploadService";
import { validateVehicleImage } from "../utils/validators";

function ImageUploader({ setReceipt }) {
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState("Entry");
  const [loading, setLoading] = useState(false);
  const [gateMessage, setGateMessage] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setVehicleImage(file);
      setMessage("");
      setMessageType("");
    }
  }

  function reset() {
    setVehicleImage(null);
    setVehicleStatus("Entry");
    setMessage("");
    setMessageType("");
    setGateMessage("");
    setReceipt(null);
  }

  async function handleSubmit() {
    const validationError = validateVehicleImage(vehicleImage);
    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const result = await uploadVehicleImage(vehicleImage, vehicleStatus);

      setReceipt({
        licensePlate: result.licensePlate,
        status: result.status,
        entryTime: result.entryTime ? new Date(result.entryTime).toLocaleString() : new Date().toLocaleString(),
        exitTime: result.exitTime ? new Date(result.exitTime).toLocaleString() : "--",
        duration: result.duration != null ? `${result.duration} min` : "In Progress",
        fee: result.fee != null ? `R${result.fee.toFixed(2)}` : "R0.00",
      });

      const msg = result.status === "Entry"
        ? "✓ Gate Opening — Drive Safe"
        : "✓ Session Complete — Thank You";

      setGateMessage(msg);
      setMessage("");
      setVehicleImage(null);

      setTimeout(reset, 30000);

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

        {/* Gate message / error */}
        {gateMessage ? (
          <div className="message success gate-message">{gateMessage}</div>
        ) : message ? (
          <div className={`message ${messageType}`}>{message}</div>
        ) : null}

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