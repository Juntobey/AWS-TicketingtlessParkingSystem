import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";

function maskPlate(plate) {
  if (!plate || plate.length < 4) return plate;
  const parts = plate.trim().split(/\s+/);
  if (parts.length >= 3) {
    return `${parts[0]} *** ${parts[parts.length - 1]}`;
  }
  return plate.slice(0, -3) + "***";
}

function ReceiptCard({ receipt, onClear }) {
  const isExit = receipt?.status === "Exit";
  const initialCountdown = isExit ? 300 : 30;
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (!receipt) return;
    setCountdown(isExit ? 300 : 30);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); onClear(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [receipt]);

  if (!receipt) {
    return (
      <section id="receipt" className="receipt">
        <div className="receipt-card">
          <h2>Parking Session Details</h2>
          <p className="receipt-message">No parking session available.</p>
          <p className="receipt-message">
            Upload a vehicle image and click
            <strong> Process Vehicle </strong>
            to create a parking session.
          </p>
        </div>
      </section>
    );
  }



  return (
    <section id="receipt" className="receipt">
      <div className="receipt-card">
        <div className="receipt-header">
          <h2>Parking Session Details</h2>
          <span className="receipt-countdown">Clearing in {countdown > 60 ? `${Math.ceil(countdown / 60)}m ${countdown % 60}s` : `${countdown}s`}</span>
        </div>

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
            <strong>Entry Time:</strong>
            {receipt.entryTime}
          </p>
          {isExit && (
            <>
              <p>
                <strong>Exit Time:</strong>
                {receipt.exitTime}
              </p>
              <p>
                <strong>Duration:</strong>
                {receipt.duration}
              </p>
              <p>
                <strong>Parking Fee:</strong>
                {receipt.fee}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReceiptCard;
