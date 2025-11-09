import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import MeetingList from "./meetinglist";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Southwest Michigan Area NA Meetings</title>
        <link rel="icon" href="/NALogoSunburst.gif" />
      </Head>

      <main>
        <Header />
        <p className="description">
          <MeetingList />
        </p>
      </main>

      <Footer />
    </div>
  );
}
