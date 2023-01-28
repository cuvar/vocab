import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LogoutScreen from "../comp/LogoutScreen";

const Home: NextPage = () => {
  const [hasChosen, setHasChosen] = useState(false);
  const randomWord = api.word.getRandomUnlearnedWord.useQuery(
    // @ts-ignore
    {},
    { refetchOnWindowFocus: false }
  );
  const markAsLearned = api.word.markAsLearned.useMutation();
  const addWordMutation = api.word.addWord.useMutation();

  // const initDB = api.word.initDB.useMutation();

  const iwordenRef = useRef(null);
  const iworddeRef = useRef(null);
  const inotesRef = useRef(null);
  const ibusinessRef = useRef(null);

  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  function handleClick() {
    if (randomWord.data?.english) {
      markAsLearned.mutate({
        word: randomWord.data?.english,
      });
      if (markAsLearned.error) {
        alert(markAsLearned.error.message);
        return;
      }
      setHasChosen(true);
      setTimeout(() => {
        setHasChosen(false);
      }, 1000);
    } else {
      alert("no word, try refreshing.");
    }
  }

  function addWord() {
    // @ts-ignore
    const english = iwordenRef.current?.value ?? "";
    // @ts-ignore
    const german = iworddeRef.current?.value ?? "";
    // @ts-ignore
    const notes = inotesRef.current?.value ?? "";
    // @ts-ignore
    const c1business = ibusinessRef.current?.checked + "" ?? "";

    if (english == "" || german == "") {
      alert("no word");
      return;
    }

    addWordMutation.mutate({
      english: english,
      german: german,
      notes: notes,
      c1business: c1business,
    });

    if (addWordMutation.error) {
      alert("wrong data");
      return;
    }
    // @ts-ignore
    iwordenRef.current.value = "";
    // @ts-ignore
    iworddeRef.current.value = "";
    // @ts-ignore
    inotesRef.current.value = "";
    // @ts-ignore
    ibusinessRef.current.checked = false;
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1f7ea1] to-[#6ff7e8]">
        <div className="flex w-screen justify-end">
          <button
            className="mr-4 p-4 hover:underline active:text-blue-500"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-2xl tracking-tight">Your word of the day</h1>
          {!hasChosen ? (
            <div className="my-8 flex-col items-center space-y-2 text-center">
              {randomWord.data?.english == null ? (
                <p className="text-3xl text-red-700">no word available</p>
              ) : (
                <>
                  <p className="text-3xl font-bold">
                    {randomWord.data.english}
                  </p>
                  <p className="text-xl">{randomWord.data.german}</p>
                  <p className="text-xl">{randomWord.data.notes}</p>
                  {randomWord.data.c1business && (
                    <div className="text-md text-sky-900">#Business</div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="rounded-full bg-emerald-600 p-6 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-10 w-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
          )}
          <div className="flex space-x-4">
            {randomWord.data?.english != null && (
              <button
                className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
                onClick={handleClick}
              >
                Choose
              </button>
            )}
            <button
              className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
              onClick={async () => {
                await randomWord.refetch();
              }}
            >
              Generate
            </button>
          </div>
          <div className="flex flex-col space-y-8">
            <div className="flex space-x-2">
              <div className="flex flex-col justify-evenly space-y-2">
                <label htmlFor="worden">English</label>
                <label htmlFor="wordde">German</label>
                <label htmlFor="notes">Notes</label>
                <label htmlFor="business">Business</label>
              </div>
              <div className="flex flex-col justify-evenly space-y-2">
                <input
                  ref={iwordenRef}
                  type="text"
                  name="worden"
                  className="rounded-md py-2 px-2"
                />
                <input
                  ref={iworddeRef}
                  type="text"
                  name="wordde"
                  className="rounded-md py-2 px-2"
                />
                <input
                  ref={inotesRef}
                  type="text"
                  name="notes"
                  className="rounded-md py-2 px-2"
                />
                <input
                  ref={ibusinessRef}
                  type="checkbox"
                  name="business"
                  className="rounded-md py-2 px-2 pt-8"
                  value={"Business"}
                  placeholder="Business"
                />
              </div>
            </div>
            <div className="flex justify-between space-x-2">
              <button
                className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
                onClick={() => {
                  addWord();
                }}
              >
                Add Word
              </button>
            </div>
            {/* <button
              className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
              onClick={() => {
                initDB.mutate();
              }}
            >
              Init db
            </button> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
