import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <>
      <Head>
        <title>😅😅 Whatsapp Clone </title>
        <meta name="description" content="an amazing whatsapp clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Sidebar />
      </main>
    </>
  );
}
