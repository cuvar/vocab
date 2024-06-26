import { LearnMode } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Card from "../../comp/Card";
import ProgressBar from "../../comp/ProgressBar";
import { api } from "../../lib/api";
import { useToast } from "../../lib/ui/hooks";
import {
  archiveIcon,
  arrowRoundIcon,
  thumbsDownIcon,
  thumbsUpIcon,
} from "../../lib/ui/icons";
import { addCard, clearCards, getCardsIds } from "../../lib/ui/store/flashcard";
import { getLearnedWords } from "../../lib/ui/store/learned";
import { getSettings } from "../../lib/ui/store/settings";
import { type VocabularyFlashCard } from "../../server/domain/client/vocabularyFlashCard";
import { type VocabularyWord } from "../../server/domain/client/vocabularyWord";
import Error from "../Error";
import Loading from "../Loading";

type Props = {
  collectionId: string;
};

export default function FlashCards(props: Props) {
  const [words, setWords] = useState<VocabularyFlashCard[]>([]);
  const [topCardIndex, setTopCardIndex] = useState<number>(-1);
  const [topCardWord, setTopCardWord] = useState<VocabularyFlashCard | null>(
    null
  );
  const [showBack, setshowBack] = useState(false);
  const cardRef = useRef(null);
  const [unlookedWords, setUnlookedWords] = useState<VocabularyFlashCard[]>([]);

  const showToast = useToast();

  const randomizeCards = getSettings(props.collectionId).randomizeCards;

  const getLearnedQuery = api.word.getLearned.useQuery(
    { collectionId: props.collectionId },
    {
      onSuccess: (data) => {
        const transformed = toFlashCards(data);
        init(transformed);
      },
      refetchOnWindowFocus: false,
    }
  );

  const updateModeMutation = api.word.updateMode.useMutation({
    onSuccess: (data) => {
      showToast(`${data.front} marked as archived`, "success");
    },
    onError: (err) => {
      showToast(`${err.message}`, "error");
    },
  });

  useEffect(() => {
    const transformed = toFlashCards(getLearnedWords(props.collectionId));
    initState(transformed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toFlashCards(data: VocabularyWord[]) {
    const transformed: VocabularyFlashCard[] = data.map((e: VocabularyWord) => {
      return {
        id: e.id,
        front: e.front,
        back: e.back,
        notes: e.notes,
        mode: e.mode,
        iconFront: e.iconFront,
        iconBack: e.iconBack,
        collectionId: e.collectionId,
        tags: e.tags,
        cardMode: "none",
        switched: randomizeCards ? Math.random() > 0.5 : false,
      } satisfies VocabularyFlashCard;
    });
    return transformed;
  }

  function init(_words: VocabularyFlashCard[]) {
    const learnedIds = getCardsIds(true, props.collectionId);

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
    const unlearned = randomized.filter((e) => e.cardMode !== "good");

    setWords(randomized);
    setUnlookedWords(unlearned);
    setTopCardIndex(unlearned.length > 0 ? 0 : -1);
    setTopCardWord(unlearned[0] ? unlearned[0] : null);
  }

  function toggleshowBack() {
    setshowBack(!showBack);
  }

  function handleGood() {
    const word = words.find((e) => e.id === topCardWord?.id);
    if (word) {
      word.cardMode = "good";
      addCard(word, true, props.collectionId);
    }
    nextWord();
  }

  function handleBad() {
    const word = words.find((e) => e.id === topCardWord?.id);
    if (word) {
      word.cardMode = "bad";
      addCard(word, false, props.collectionId);
    }
    nextWord();
  }

  function handleReset() {
    if (topCardWord) {
      const confirmed = window.confirm(
        "Are you sure you want to reset all learned words?"
      );
      if (!confirmed) return;
    }

    clearCards(true, props.collectionId);
    words.forEach((e) => {
      e.cardMode = "none";
    });
    init(words);
  }

  function nextWord() {
    if (unlookedWords.length > topCardIndex + 1) {
      setTopCardIndex(topCardIndex + 1);
      const nextWord = unlookedWords[topCardIndex + 1];
      setTopCardWord(nextWord ?? null);
      animate();
    } else {
      const unlearned = words.filter((e) => e.cardMode === "bad");
      if (unlearned.length > 0) {
        setUnlookedWords(unlearned);
        setTopCardIndex(0);
        setTopCardWord(unlearned[0] ?? null);
      } else {
        setTopCardIndex(-1);
        setTopCardWord(null);
      }
    }
    setshowBack(false);
  }

  function animate() {
    if (!cardRef.current) return;

    (cardRef.current as HTMLElement).style.opacity = "0";

    setTimeout(() => {
      if (!cardRef.current) return;

      (cardRef.current as HTMLElement).style.opacity = "1";
    }, 100);
  }

  function handleArchive() {
    if (!topCardWord) {
      return;
    }

    nextWord();

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
        Flash Cards: {unlookedWords.length}
      </h1>
      <ProgressBar max={unlookedWords.length} current={topCardIndex + 1} />
      <div className="flex w-full max-w-[24rem] flex-col items-center space-y-12">
        {topCardWord ? (
          <>
            <div
              onClick={toggleshowBack}
              className="flex h-60 w-full items-center justify-center"
              ref={cardRef}
            >
              <Card word={topCardWord} showBack={showBack} />
            </div>
            <div className="flex w-full flex-col space-y-10">
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
                    onClick={handleReset}
                  >
                    {arrowRoundIcon}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg italic">No more words to learn</p>
            <div className="flex w-full items-stretch justify-evenly space-x-4 text-black">
              <button
                className="flex w-full items-center justify-center rounded-md bg-primary py-2 active:opacity-80"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
