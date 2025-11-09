import { useEffect, useState } from "react";

function extractMeetingsFromJsonp(responseText) {
  const match = responseText.match(/^[\s\S]*?\(\s*(\{[\s\S]*\})\s*\)\s*;?\s*$/);
  if (!match) throw new Error("Unexpected JSONP format");

  const payload = JSON.parse(match[1]);
  return payload.meetings || [];
}

async function performFetch() {
  const res = await fetch(
    "https://michigan-na.org/bmlt/client_interface/jsonp/?switcher=GetSearchResults&get_used_formats&lang_enum=en&services[]=4&sort_keys=start_time&callback=jsonp_1762645064064_22439"
  ).then((r) => r.text());

  return extractMeetingsFromJsonp(res);
}

const MeetingList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    performFetch().then((d) => setData(d));
  }, []);

  useEffect(() => console.log("data", data), [data]);
  return <>Meeting List</>;
};

export default MeetingList;
