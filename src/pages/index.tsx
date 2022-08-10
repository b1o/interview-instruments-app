import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <>
      <main className="container mx-auto flex flex-col items-center justify-center p-4">
        Home Page
      </main>
    </>
  );
};

export default Home;
