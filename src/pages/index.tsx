import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [hasChosen, setHasChosen] = useState(false);
  const { data, refetch } = api.word.getRandomUnlearnedWord.useQuery();
  const markAsLearned = api.word.markAsLearned.useMutation();
  // const getWord = api.word.getWord.useQuery({ word: "" });

  function handleClick() {
    if (data?.english) {
      markAsLearned.mutate({ word: data?.english });
      setHasChosen(true);
      setTimeout(() => {
        setHasChosen(false);
      }, 1000);
    } else {
      alert("no word, try refreshing.");
    }
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
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-2xl tracking-tight">Your word of the day</h1>
          {!hasChosen ? (
            <div className="my-8 flex-col items-center space-y-2 text-center">
              {data?.english == null ? (
                <p className="text-3xl text-red-700">no word available</p>
              ) : (
                <>
                  <p className="text-3xl font-bold">{data.english}</p>
                  <p className="text-xl">{data.german}</p>
                  <p className="text-xl">{data.notes}</p>
                  {data.c1business && (
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
            {data?.english != null && (
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
                await refetch();
              }}
            >
              Generate
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
