const Meeting = ({ props }) => {
  const {
    meeting_name,
    start_time,
    weekday_tinyint,
    location_street,
    location_municipality,
    location_province,
    formats,
    virtual_meeting_link,
    phone_meeting_number,
  } = props;

  const weekdayNames = [
    "",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div
      style={{
        background: "#f2f7ff", // pale blue
        padding: "12px 16px",
        borderRadius: "10px",
        marginBottom: "12px",
        border: "1px solid #e3e9f5",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {/* Title */}
      <h3 style={{ margin: 0, marginBottom: "6px", color: "#234" }}>
        {meeting_name}
      </h3>

      {/* Time + Day */}
      <div style={{ marginBottom: "6px", color: "#345", fontSize: "0.95rem" }}>
        <strong>{weekdayNames[Number(weekday_tinyint)]}</strong> at{" "}
        {start_time.slice(0, 5)}
      </div>

      {/* Location */}
      <div style={{ marginBottom: "6px", fontSize: "0.9rem", color: "#456" }}>
        {location_street && <div>{location_street}</div>}
        {(location_municipality || location_province) && (
          <div>
            {location_municipality}
            {location_municipality && location_province ? ", " : ""}
            {location_province}
          </div>
        )}
      </div>

      {/* Formats */}
      {formats && (
        <div
          style={{
            fontSize: "0.85rem",
            marginBottom: "8px",
            color: "#567",
          }}
        >
          <strong>Formats:</strong> {formats}
        </div>
      )}

      {/* Virtual options */}
      {virtual_meeting_link && (
        <div style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
          <a
            href={virtual_meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2a5bd7",
              textDecoration: "underline",
            }}
          >
            Join Virtual Meeting
          </a>
        </div>
      )}

      {phone_meeting_number && (
        <div style={{ fontSize: "0.85rem", color: "#567" }}>
          Phone: {phone_meeting_number}
        </div>
      )}
    </div>
  );
};

export default Meeting;
