import { useEffect, useMemo, useState } from "react";

/** ---------- helpers ---------- */
function extractMeetingsFromJsonp(responseText) {
  // grab the {...} inside jsonp_XXXX({...});
  const match = responseText.match(/^[\s\S]*?\(\s*(\{[\s\S]*\})\s*\)\s*;?\s*$/);
  if (!match) throw new Error("Unexpected JSONP format");
  return JSON.parse(match[1]);
}

async function fetchMeetings() {
  const url =
    "https://michigan-na.org/bmlt/client_interface/jsonp/?switcher=GetSearchResults&get_used_formats&lang_enum=en&services[]=4&sort_keys=start_time&callback=jsonp_1762645064064_22439";
  const text = await fetch(url).then((r) => r.text());
  const payload = extractMeetingsFromJsonp(text); // { meetings: [...], formats: [...] }
  return payload;
}

function jsDayToBmltDay(jsDay) {
  // JS: 0=Sun..6=Sat, BMLT: 1=Sun..7=Sat
  return jsDay === 0 ? 1 : jsDay + 1;
}

function formatTime(hms) {
  // "HH:mm:ss" -> "h:mm a"
  const [h, m] = hms.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** ---------- UI bits ---------- */
const TabBar = ({ selectedDay, onSelect }) => {
  return (
    <div
      style={{ display: "flex", gap: 8, margin: "12px 0", flexWrap: "wrap" }}
    >
      {DAY_LABELS.map((label, idx) => {
        const dayVal = idx === 0 ? 1 : idx + 1; // 1..7
        const active = selectedDay === dayVal;
        return (
          <button
            key={label}
            onClick={() => onSelect(dayVal)}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              border: active ? "1px solid #1976d2" : "1px solid #ccc",
              background: active ? "#e8f2ff" : "#fff",
              cursor: "pointer",
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

const Meeting = ({ m, formatMap }) => {
  const prettyFormats = useMemo(() => {
    if (!m.formats) return [];
    const keys = String(m.formats)
      .split(",")
      .map((s) => s.trim());
    return keys
      .map((k) => formatMap.get(k))
      .filter(Boolean)
      .map((f) => f.name_string);
  }, [m.formats, formatMap]);

  return (
    <div
      style={{
        background: "rgba(25, 118, 210, 0.06)", // pale blue
        borderRadius: 12,
        padding: "12px 14px",
        margin: "8px 0",
        border: "1px solid #e5eef9",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
        {m.meeting_name || "Untitled meeting"}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 14 }}>
        <span>
          <strong>Starts:</strong> {formatTime(m.start_time)}
        </span>
        {m.duration_time && (
          <span>
            <strong>Duration:</strong> {m.duration_time.slice(0, 5)}{" "}
          </span>
        )}
        {prettyFormats.length > 0 && (
          <span>
            <strong>Formats:</strong> {prettyFormats.join(", ")}
          </span>
        )}
      </div>

      <div style={{ marginTop: 6, fontSize: 14, color: "#333" }}>
        {m.location_text && <div>{m.location_text}</div>}
        {(m.location_street ||
          m.location_municipality ||
          m.location_province ||
          m.location_postal_code_1) && (
          <div>
            {[
              m.location_street,
              m.location_municipality,
              m.location_province,
              m.location_postal_code_1,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
      </div>

      {(m.virtual_meeting_link || m.phone_meeting_number) && (
        <div style={{ marginTop: 6, fontSize: 14 }}>
          {m.virtual_meeting_link && (
            <div>
              <strong>Join:</strong>{" "}
              <a href={m.virtual_meeting_link} target="_blank" rel="noreferrer">
                {m.virtual_meeting_link}
              </a>
            </div>
          )}
          {m.phone_meeting_number && (
            <div>
              <strong>Dial-in:</strong> {m.phone_meeting_number}
            </div>
          )}
          {m.virtual_meeting_additional_info && (
            <div style={{ color: "#444" }}>
              {m.virtual_meeting_additional_info}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/** ---------- main component ---------- */
const MeetingList = () => {
  const [selectedDay, setSelectedDay] = useState(() =>
    jsDayToBmltDay(new Date().getDay())
  ); // 1..7
  const [meetings, setMeetings] = useState([]);
  const [formatMap, setFormatMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const payload = await fetchMeetings(); // {meetings, formats}
        if (cancelled) return;

        const fm = new Map(
          (payload.formats || []).map((f) => [String(f.key_string).trim(), f])
        );

        setFormatMap(fm);
        setMeetings(Array.isArray(payload.meetings) ? payload.meetings : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dayMeetings = useMemo(() => {
    // BMLT weekday_tinyint is often a string; coerce to number.
    const filtered = meetings.filter(
      (m) => Number(m.weekday_tinyint) === selectedDay
    );
    // sort by start_time "HH:mm:ss"
    return filtered.sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [meetings, selectedDay]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: "crimson" }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <TabBar selectedDay={selectedDay} onSelect={setSelectedDay} />
      {dayMeetings.length === 0 ? (
        <div style={{ color: "#666" }}>No meetings for this day.</div>
      ) : (
        dayMeetings.map((m) => (
          <Meeting
            key={`${m.id_bigint}-${m.start_time}`}
            m={m}
            formatMap={formatMap}
          />
        ))
      )}
    </div>
  );
};

export default MeetingList;
