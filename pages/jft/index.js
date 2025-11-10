import Footer from "@components/Footer";
import Header from "@components/Header";
import { useEffect, useState } from "react";

const Jft = () => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("https://www.jftna.org/jft/");

        // if blocked by CORS, this will throw
        const text = await res.text();
        if (!cancelled) setHtml(text);
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // if (error) {
  //   return (
  //     <div style={{ color: "crimson" }}>Error loading content: {error}</div>
  //   );
  // }

  if (!html) {
    return <div>Loading…</div>;
  }
  return (
    <>
      <Head>
        <title>Southwest Michigan Area NA Meetings</title>
        <link rel="icon" href="/NALogoSunburst.gif" />
      </Head>

      <Header />
      <main>
        <div
          style={{ padding: "1rem" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
    </>
  );
};

export default Jft;
