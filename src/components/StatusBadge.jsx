function StatusBadge({ status }) {

  let badgeClass = "status-badge";

  if (status === "Entry") {
    badgeClass += " entry";
  } else if (status === "Exit") {
    badgeClass += " exit";
  } else {
    badgeClass += " processing";
  }

  return (
    <span className={badgeClass}>
      {status}
    </span>
  );

}

export default StatusBadge;