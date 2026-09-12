import StatusBadge from "./StatusBadge";


function ReceiptCard({ receipt }) {

  if (!receipt) {

    return (

      <section id="receipt" className="receipt">

        <div className="receipt-card">

          <h2>Parking Session Details</h2>

          <p className="receipt-message">

            No parking session available.

          </p>

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

        <h2>Parking Session Details</h2>

        <div className="receipt-content">

          <p>

            <strong>Licence Plate:</strong>{" "}

            {receipt.licensePlate}

          </p>

          <p>

            <strong>Parking Status:</strong>{" "}

            <StatusBadge status={receipt.status} />

          </p>

          <p>

            <strong>Entry Date & Time:</strong>{" "}

            {receipt.entryTime}

          </p>

          <p>

            <strong>Exit Date & Time:</strong>{" "}

            {receipt.exitTime}

          </p>

          <p>

            <strong>Parking Duration:</strong>{" "}

            {receipt.duration}

          </p>

          <p>

            <strong>Parking Fee:</strong>{" "}

            {receipt.fee}

          </p>

        </div>

      </div>

    </section>

  );

}

export default ReceiptCard;