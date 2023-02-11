import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LogoutScreen from "../comp/LogoutScreen";
import Generator from "../comp/Generator";
import List from "../comp/List";

interface VocabularyWord {
  english: string;
  german: string;
  notes: string;
  learned: boolean;
  c1business: boolean;
}

type Tab = "generator" | "list";
type TabDisplay = "Generator" | "List";

const TABS: Record<Tab, TabDisplay> = {
  generator: "Generator",
  list: "List",
} as const;

const Home: NextPage = () => {
  const [wordToSearch, setWordToSearch] = useState("");
  const [wordToGet, setWordToGet] = useState("");
  const [tab, setTab] = useState<Tab>("generator");

  const [wordToDisplay, setWordToDisplay] = useState<VocabularyWord | null>(
    null
  );

  const iwordenRef = useRef(null);

  const randomWord = api.word.getRandomUnlearnedWord.useQuery(
    // @ts-ignore
    {},
    { refetchOnWindowFocus: false }
  );

  // const initDB = api.word.initDB.useMutation();
  const searchWord = api.word.searchWord.useQuery(
    {
      word: wordToSearch,
    },
    {
      enabled: false,
    }
  );
  const getWordQuery = api.word.getWord.useQuery(
    {
      word: wordToGet,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!randomWord.data) {
      return;
    }

    setWordToDisplay({
      english: randomWord.data.english,
      german: randomWord.data.german,
      notes: randomWord.data.notes,
      learned: randomWord.data.learned,
      c1business: randomWord.data.c1business,
    });
  }, [randomWord.data]);

  useEffect(() => {
    if (wordToSearch == "") {
      return;
    }

    searchWord.refetch().then((res) => {
      console.log(res.data);
      if (res.data?.length == 0) {
        return;
      }

      alert(res.data);
      // @ts-ignore
      iwordenRef.current.value = "";
      setWordToSearch("");
    });
  }, [wordToSearch]);

  useEffect(() => {
    if (wordToGet == "") {
      return;
    }

    getWordQuery.refetch().then((res) => {
      if (!res.data) {
        alert("no word found");
        return;
      }
      setWordToDisplay({
        english: res.data.english,
        german: res.data.german,
        notes: res.data.notes,
        learned: res.data.learned,
        c1business: res.data.c1business,
      });

      // @ts-ignore
      iwordenRef.current.value = "";
      setWordToGet("");
    });
  }, [wordToGet]);

  function switchTab(clicked: Tab) {
    setTab(clicked);
    console.log();
  }
  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
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
            {tab == "list" && <List />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
