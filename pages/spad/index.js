import Footer from "@components/Footer";
import Header from "@components/Header";
import Head from "next/head";

const Spad = () => {
  return (
    <>
      <Head>
        <title>Southwest Michigan Area NA Meetings</title>
        <link rel="icon" href="/NALogoSunburst.gif" />
      </Head>

      <Header />
      <main>SPAD</main>
      <Footer />
    </>
  );
};

export default Spad;
