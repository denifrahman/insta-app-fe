import Head from "next/head";
import Image from "next/image";
import Header from "./components/header/Header";
import HomePage from "./home/component/HomeFeeds";

export default function Home() {
  return (
    <div className="h-screen overflow-y-scroll bg-[#fafafa] text-[#262626] dark:bg-[#131313] dark:text-[#f1f5f9] dark:[color-scheme:dark]">
      <Head>
        <title>Instagram Fake</title>
        <meta name="description" content="Insta App" />
        <link rel="icon" href="/denifrahman.png" />
      </Head>
      <Header page="Home" />

      <HomePage></HomePage>


    </div>
  );
}
