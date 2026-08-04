import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";

function maskPlate(plate) {
  if (!plate || plate.length < 4) return plate;
  return plate.slice(0, 2) + "***" + plate.slice(-2);
}

function formatCountdown(s) {
  if (s >= 60) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${s}s`;
}

function ReceiptCard({ receipt }) {
  const isExit = receipt?.status?.toLowerCase() === "exit";
  const duration = isExit ? 300 : 30;

  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!receipt) { setCountdown(null); return; }
    setCountdown(duration);
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(id); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [receipt]);

  if (!receipt || countdown === 0) {
    return (
      <section id="receipt" className="receipt">
        <div className="receipt-card">
          <h2>Parking Session Details</h2>
          <p className="receipt-message">No parking session available.</p>
          <p className="receipt-message">
            Upload a vehicle image and click <strong> Process Vehicle </strong>
            to create a parking session.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="receipt" className="receipt">
      <div className="receipt-card">
        <h2>Parking Session Details</h2>

        <div className="receipt-content">
          <p>
            <strong>Licence Plate:</strong>
            {maskPlate(receipt.licensePlate)}
          </p>
          <p>
            <strong>Parking Status:</strong>
            <StatusBadge status={receipt.status} />
          </p>
          <p>
            <strong>Entry Date &amp; Time:</strong>
            {receipt.entryTime}
          </p>
          {isExit && (
            <>
              <p>
                <strong>Exit Date &amp; Time:</strong>
                {receipt.exitTime}
              </p>
              <p>
                <strong>Parking Duration:</strong>
                {receipt.duration}
              </p>
              <p>
                <strong>Parking Fee:</strong>
                {receipt.fee}
              </p>
            </>
          )}
        </div>

        <p className="countdown-badge">
          Clears in {formatCountdown(countdown)}
        </p>
      </div>
    </section>
  );
}

export default ReceiptCard;
