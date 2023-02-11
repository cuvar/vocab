import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LogoutScreen from "../comp/LogoutScreen";
import Generator from "../comp/Generator";
import Learned from "../comp/Learned";
import AllWords from "../comp/AllWords";

interface VocabularyWord {
  english: string;
  german: string;
  notes: string;
  learned: boolean;
  c1business: boolean;
}

type Tab = "generator" | "list" | "all";
type TabDisplay = "Generator" | "Learned" | "All words";

const TABS: Record<Tab, TabDisplay> = {
  list: "Learned",
  generator: "Generator",
  all: "All words",
} as const;

const Home: NextPage = () => {
  const [tab, setTab] = useState<Tab>("list");
  // const initDB = api.word.initDB.useMutation();

  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  function switchTab(clicked: Tab) {
    setTab(clicked);
    console.log();
  }

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta
          name="description"
          content="A tool for choosing a word to learn every day"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#1f7ea1] to-[#6ff7e8]">
        <div className="mb-4 flex w-screen justify-end">
          <button
            className="mr-4 p-4 hover:underline active:text-blue-500"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
        <div className="flex w-full flex-col items-center ">
          <div className="flex space-x-8">
            {(Object.keys(TABS) as Tab[]).map((e) => {
              const custom = tab === e ? "font-bold" : "";
              return (
                <button
                  key={e}
                  onClick={() => switchTab(e)}
                  className={`${custom} text-xl `}
                >
                  {TABS[e]}
                </button>
              );
            })}
          </div>
          <div className="my-16 flex w-full justify-center">
            {tab == "generator" && <Generator />}
            {tab == "list" && <Learned />}
            {tab == "all" && <AllWords />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
