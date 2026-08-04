import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import StatusBadge from "./StatusBadge";

function maskPlate(plate) {
  if (!plate || plate.length < 4) return plate;
  return plate.slice(0, 2) + "***" + plate.slice(-2);
}

function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSessions = () => {
    fetch(`${API_BASE_URL}/sessions`)
      .then((r) => r.json())
      .then((data) => { setSessions(data.sessions || []); setError(null); })
      .catch(() => setError("Could not load sessions."));
  };

  useEffect(() => {
    fetchSessions();
    const id = setInterval(fetchSessions, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sessions">
      <div className="sessions-card">
        <h2>Active Parking Sessions</h2>

        {error && <p className="receipt-message">{error}</p>}

        {!error && sessions.length === 0 && (
          <p className="receipt-message">No active sessions at the moment.</p>
        )}

        {sessions.map((s, i) => (
          <div className="session-row" key={i}>
            <span className="session-plate">{maskPlate(s.licensePlate)}</span>
            <span className="session-time">{s.entryTime}</span>
            <StatusBadge status="entry" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SessionList;
