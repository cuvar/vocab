import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import Card from "../comp/Card";
import ProgressBar from "../comp/ProgressBar";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { type VocabularyFlashCard, type VocabularyWord } from "../types/types";
import { api } from "../utils/api";
import {
  addLearnedWords,
  clearLearnedWords,
  getLearnedWordIds,
} from "../utils/client-store";
import {
  archiveIcon,
  arrowRoundIcon,
  thumbsDownIcon,
  thumbsUpIcon,
} from "../utils/icons";
import Error from "./Error";
import Loading from "./Loading";
import { getLearnedWords } from "../service/cache";

export default function FlashCards() {
  const [words, setWords] = useState<VocabularyFlashCard[]>([]);
  const [topCardIndex, setTopCardIndex] = useState<number>(-1);
  const [topCardWord, setTopCardWord] = useState<VocabularyFlashCard | null>(
    null
  );
  const [showNative, setShowNative] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const cardRef = useRef(null);
  const [unlearnedWords, setUnlearnedWords] = useState<VocabularyFlashCard[]>(
    []
  );
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  const getLearnedQuery = api.word.getLearned.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed = toFlashCards(data);
      init(transformed);
    },
    refetchOnWindowFocus: false,
  });

  const updateModeMutation = api.word.updateMode.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`${data.translation} marked as archived`);

      setTimeout(() => {
        setToastText("");
      }, 1500);
      nextWord();
    },
    onError: (err) => {
      setToastType("error");
      setToastText(err.message);

      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  useEffect(() => {
    const transformed = toFlashCards(getLearnedWords());
    initState(transformed);
  }, []);

  function toFlashCards(data: VocabularyWord[]) {
    const transformed: VocabularyFlashCard[] = data.map((e: VocabularyWord) => {
      return {
        ...e,
        cardMode: "none",
        switched: switchChecked ? Math.random() > 0.5 : false,
      };
    });
    return transformed;
  }

  function init(_words: VocabularyFlashCard[]) {
    const learnedIds = getLearnedWordIds();

    _words.forEach((e) => {
      const found = learnedIds.find((l) => l === e.id);
      if (found) {
        e.cardMode = found ? "good" : "none";
      }
    });

    initState(_words);
  }

  function initState(_words: VocabularyFlashCard[]) {
    const randomized = _words.sort(() => Math.random() - 0.5);
    const unlearned = randomized.filter(
      (e) => e.cardMode === "none" || e.cardMode === "bad"
    );

    setWords(randomized);
    setUnlearnedWords(unlearned);
    setTopCardIndex(unlearned.length > 0 ? 0 : -1);
    setTopCardWord(unlearned[0] ? unlearned[0] : null);
  }

  function toggleShowNative() {
    setShowNative(!showNative);
  }

  function handleGood() {
    const word = words.find((e) => e.id === topCardWord?.id);
    if (word) {
      word.cardMode = "good";
      addLearnedWords(word);
    }
    nextWord();
  }

  function handleBad() {
    const word = words.find((e) => e.id === topCardWord?.id);
    if (word) {
      word.cardMode = "bad";
    }
    nextWord();
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all learned words?"
    );
    if (!confirmed) return;

    clearLearnedWords();
    words.forEach((e) => {
      e.cardMode = "none";
    });
    init(words);
  }

  function nextWord() {
    if (unlearnedWords.length > topCardIndex + 1) {
      setTopCardIndex(topCardIndex + 1);
      const nextWord = unlearnedWords[topCardIndex + 1];
      setTopCardWord(nextWord ?? null);
      animate();
    } else {
      const unlearned = words.filter((e) => e.cardMode === "bad");
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

  function handleSwitchChange() {
    const newChecked = !switchChecked;
    setSwitchChecked(newChecked);
    const newUnlearned = unlearnedWords.map((w) => {
      w.switched = newChecked ? Math.random() > 0.5 : false;
      return w;
    });
    setUnlearnedWords(newUnlearned);
  }

  function handleArchive() {
    if (!topCardWord) {
      return;
    }

    updateModeMutation.mutate({
      id: topCardWord.id,
      mode: LearnMode.ARCHIVED,
    });
  }

  if (getLearnedQuery.isLoading) {
    return <Loading />;
  }

  if (!words || !getLearnedQuery.data) {
    return <Error msg={"No data available"} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 text-2xl tracking-tight">
        Flash card mode: {unlearnedWords.length} words
      </h1>
      <div className="flex w-full">
        <label className="label mr-4 flex cursor-pointer space-x-2">
          <input
            type="checkbox"
            checked={switchChecked}
            className="checkbox"
            onChange={handleSwitchChange}
          />
          <span className="label-text">Randomize</span>
        </label>
      </div>
      <ProgressBar max={unlearnedWords.length} current={topCardIndex + 1} />
      <div className="flex w-full max-w-[24rem] flex-col items-center space-y-12">
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
        <div className="flex w-full flex-col space-y-10">
          {topCardWord && (
            <div className="flex w-full flex-col space-y-10">
              <div className="flex h-14 w-full items-stretch justify-evenly space-x-4 text-black">
                <button
                  className="flex w-full items-center justify-center rounded-md bg-error py-2 active:opacity-80"
                  onClick={handleBad}
                >
                  {thumbsDownIcon}
                </button>
                <button
                  className="flex w-full items-center justify-center rounded-md bg-success py-4 active:opacity-80"
                  onClick={handleGood}
                >
                  {thumbsUpIcon}
                </button>
              </div>
              <div className="flex h-14 w-full items-stretch justify-evenly space-x-4 text-black">
                <button
                  className="flex w-full items-center justify-center rounded-md bg-accent py-2 active:opacity-80"
                  onClick={handleArchive}
                >
                  {archiveIcon}
                </button>
                <button
                  className="flex w-full items-center justify-center rounded-md bg-secondary py-2 active:opacity-80"
                  onClick={toggleShowNative}
                >
                  {arrowRoundIcon}
                </button>
              </div>
            </div>
          )}
          <div className="flex w-full items-stretch justify-evenly space-x-4 text-black">
            <button
              className="flex w-full items-center justify-center rounded-md bg-primary py-2 active:opacity-80"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
