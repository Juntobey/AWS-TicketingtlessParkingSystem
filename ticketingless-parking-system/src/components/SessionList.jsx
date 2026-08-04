import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import StatusBadge from "./StatusBadge";

function maskPlate(plate) {
  if (!plate || plate.length < 4) return plate;
  const parts = plate.trim().split(/\s+/);
  if (parts.length >= 3) return `${parts[0]} *** ${parts[parts.length - 1]}`;
  return plate.slice(0, -3) + "***";
}

function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  async function fetchSessions() {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions`);
      if (!res.ok) throw new Error("Failed to fetch sessions.");
      setSessions(await res.json());
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="sessions">
      <div className="sessions-card">
        <div className="sessions-header">
          <h2>Active Sessions</h2>
          <span className="sessions-count">{sessions.length} active</span>
        </div>

        {error && <p className="sessions-error">{error}</p>}

        {!error && sessions.length === 0 && (
          <p className="sessions-empty">No active parking sessions.</p>
        )}

        {sessions.length > 0 && (
          <ul className="sessions-list">
            {sessions.map((s, i) => (
              <li key={i} className="session-row">
                <span className="session-plate">{maskPlate(s.licensePlate)}</span>
                <span className="session-time">
                  {new Date(s.entryTime).toLocaleString()}
                </span>
                <StatusBadge status="Entry" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default SessionList;
