import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [hasChosen, setHasChosen] = useState(false);
  const [getWordWord, setGetWordWord] = useState("");
  const randomWord = api.word.getRandomUnlearnedWord.useQuery();
  const markAsLearned = api.word.markAsLearned.useMutation();
  const addWordMutation = api.word.addWord.useMutation();
  const getWordQuery = api.word.getWord.useQuery(
    { word: getWordWord },
    {
      enabled: false,
    }
  );

  function handleClick() {
    if (randomWord.data?.english) {
      markAsLearned.mutate({ word: randomWord.data?.english });
      setHasChosen(true);
      setTimeout(() => {
        setHasChosen(false);
      }, 1000);
    } else {
      alert("no word, try refreshing.");
    }
  }

  function addWord() {
    const english = prompt("English");
    const german = prompt("German");
    const notes = prompt("Notes");
    const c1business = prompt("C1 Business?");
    const pw = prompt("Password");
    addWordMutation.mutate({
      english: english ?? "",
      german: german ?? "",
      notes: notes ?? "",
      c1business: c1business ?? "",
      password: pw ?? "",
    });
  }

  // async function getWord() {
  //   setGetWordWord(prompt("Word") ?? "");
  //   const res = await getWordQuery.refetch();

  //   console.log(res.data);
  //   if (res.data == null) return alert("no word found");
  //   alert(JSON.stringify(res.data));
  // }

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
          <div className="flex space-x-4">
            <button
              className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
              onClick={() => {
                addWord();
              }}
            >
              Add Word
            </button>
            {/* <button
              className="rounded-lg border-2 border-[#135770] px-4 py-2 text-xl hover:shadow-lg active:bg-[#135770] active:text-white"
              onClick={async () => {
                await getWord();
              }}
            >
              Get Word
            </button> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
