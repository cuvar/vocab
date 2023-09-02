import { useRef, useState } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";
import Error from "./Error";
import { arrowRoundIcon, thumbsDownIcon, thumbsUpIcon } from "../utils/icons";
import Card from "./Card";

export default function FlashCards() {
  const [words, setWords] = useState<VocabularyFlashCard[]>([]);
  const [unlearnedWords, setUnlearnedWords] = useState<VocabularyWord[]>([]);
  const [topCardIndex, setTopCardIndex] = useState<number>(-1);
  const [topCardWord, setTopCardWord] = useState<VocabularyWord | null>(null);
  const [showNative, setShowNative] = useState(false);
  const cardRef = useRef(null);

  const getLearnedQuery = api.word.getLearned.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: VocabularyFlashCard[] = data.map(
        (e: VocabularyWord) => {
          return {
            ...e,
            mode: "none",
          };
        }
      );
      const randomized = transformed.sort(() => Math.random() - 0.5);
      setWords(randomized);
      const unlearned = randomized.filter(
        (e) => e.mode === "none" || e.mode === "bad"
      );
      setUnlearnedWords(unlearned);
      setTopCardIndex(unlearned.length > 0 ? 0 : -1);
      setTopCardWord(unlearned[0] ? unlearned[0] : null);
    },
    refetchOnWindowFocus: false,
  });

  function toggleShowNative() {
    setShowNative(!showNative);
  }

  function handleGood() {
    const word = words.find((e) => e.id === topCardWord?.id);
    if (word) {
      word.mode = "good";
    }
    nextWord();
  }

  function handleBad() {
    const word = words.find((e) => e.id === topCardWord?.id);
    if (word) {
      word.mode = "bad";
    }
    nextWord();
  }

  function nextWord() {
    if (unlearnedWords.length > topCardIndex + 1) {
      setTopCardIndex(topCardIndex + 1);
      const nextWord = unlearnedWords[topCardIndex + 1];
      setTopCardWord(nextWord ?? null);
      animate();
    } else {
      const unlearned = words.filter((e) => e.mode === "bad");
      if (unlearned.length > 0) {
        setUnlearnedWords(unlearned);
        setTopCardIndex(0);
        setTopCardWord(unlearned[0] ?? null);
      } else {
        setTopCardIndex(-1);
        setTopCardWord(null);
      }
    }
    setShowNative(false);
  }

  function animate() {
    if (!cardRef.current) return;

    (cardRef.current as HTMLElement).style.opacity = "0";

    setTimeout(() => {
      if (!cardRef.current) return;

      (cardRef.current as HTMLElement).style.opacity = "1";
    }, 100);
  }

  if (getLearnedQuery.isLoading) {
    return <Loading />;
  }

  if (!words || !getLearnedQuery.data) {
    return <Error msg={"No data available"} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="text-2xl tracking-tight">
        Flash card mode: {unlearnedWords.length} words
      </h1>
      <div className="my-5 flex w-full max-w-[24rem] flex-col items-center space-y-12">
        {topCardWord ? (
          <div
            onClick={toggleShowNative}
            className="flex h-60 w-full items-center justify-center"
            ref={cardRef}
          >
            <Card word={topCardWord} showNative={showNative} />
          </div>
        ) : (
          <p className="text-lg italic">No more words to learn</p>
        )}
        {topCardWord ? (
          <div className="flex w-full items-stretch justify-evenly space-x-4 text-black">
            <button
              className="flex w-full items-center justify-center rounded-md bg-error py-2 active:opacity-80"
              onClick={handleBad}
            >
              {thumbsDownIcon}
            </button>
            <button
              className="flex w-full items-center justify-center rounded-md bg-secondary py-2 active:opacity-80"
              onClick={toggleShowNative}
            >
              {arrowRoundIcon}
            </button>
            <button
              className="flex w-full items-center justify-center rounded-md bg-success py-4 active:opacity-80"
              onClick={handleGood}
            >
              {thumbsUpIcon}
            </button>
          </div>
        ) : (
          <div className="flex w-full items-stretch justify-evenly space-x-4 text-black">
            <button
              className="flex w-full items-center justify-center rounded-md bg-primary py-2 active:opacity-80"
              onClick={handleBad}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
