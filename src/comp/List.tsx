import { useEffect, useRef, useState } from "react";
import { type ActionData } from "swiper-action";
import { env } from "../env/client.mjs";
import { searchWord } from "../server/service/search.service";
import Error from "../sites/Error";
import { type ListElement } from "../types/types";
import { AMOUNT_OF_WORDS_PER_PAGE } from "../utils/const";
import {
  chevronLeft,
  chevronRight,
  doubleChevronLeft,
  doubleChevronRight,
  resetIcon,
} from "../utils/icons";
import ListItem from "./ListItem";

type Props = {
  words: ListElement[];
  markHandler?: (word: string, mark: boolean) => void;
  actions?: ActionData[];
  markLearned?: boolean;
  enableClickingItems: boolean;
  showNative: boolean;
};

export default function List(props: Props) {
  const [currentShown, setCurrentShown] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [sorted, setSorted] = useState<ListElement[]>([]);
  const [page, setPage] = useState(0);
  const [pageWords, setPageWords] = useState(
    wordsToDisplay.slice(
      0 + page * AMOUNT_OF_WORDS_PER_PAGE,
      AMOUNT_OF_WORDS_PER_PAGE + page * AMOUNT_OF_WORDS_PER_PAGE
    )
  );
  const iwordenRef = useRef(null);

  const MAX_PAGES = Math.ceil(wordsToDisplay.length / AMOUNT_OF_WORDS_PER_PAGE);

  useEffect(() => {
    const sortedWords = props.words
      .sort((a, b) => a.word.localeCompare(b.word))
      .map((e) => transformForShowNative(props.showNative, e));

    setWordsToDisplay(sortedWords);
    setSorted(sortedWords);
  }, [props.words, props.showNative]);

  useEffect(() => {
    setPageWords(
      wordsToDisplay.slice(
        0 + page * AMOUNT_OF_WORDS_PER_PAGE,
        AMOUNT_OF_WORDS_PER_PAGE + page * AMOUNT_OF_WORDS_PER_PAGE
      )
    );
  }, [wordsToDisplay, page]);

  if (sorted.length === 0) {
    return <Error msg={"No data available"} />;
  }

  function toggleCurrentShown(e: string) {
    if (currentShown != e) {
      setCurrentShown(e);
      return;
    }

    setCurrentShown("");
  }

  function searchForWord() {
    if (!iwordenRef.current) {
      return;
    }

    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    const input = iwordenRef.current.value ?? "";

    if (input == "") {
      setWordsToDisplay(sorted);
      setShowReset(false);
      return;
    }

    setShowReset(true);
    const words = searchWord(sorted, input as string);

    setWordsToDisplay(words.filter((r) => r !== null) as ListElement[]);
  }

  function resetSearch() {
    if (!iwordenRef.current) return;
    // eslint-disable-next-line
    // @ts-ignore
    iwordenRef.current.value = "";
    setWordsToDisplay(sorted);
    setShowReset(false);
  }

  function transformForShowNative(showNative: boolean, e: ListElement) {
    if (showNative) {
      // show german
      return {
        ...e,
        word: e.otherWord,
        otherWord: e.word,
        iconNative: env.NEXT_PUBLIC_TRANSLATION_ICON,
        iconTranslation: env.NEXT_PUBLIC_NATIVE_ICON,
      };
    } else {
      // show english
      return {
        ...e,
        word: e.otherWord,
        otherWord: e.word,
        iconNative: env.NEXT_PUBLIC_NATIVE_ICON,
        iconTranslation: env.NEXT_PUBLIC_TRANSLATION_ICON,
      };
    }
  }

  function handlePrevPage() {
    if (page < 1) {
      return;
    }
    setPage(page - 1);
  }

  function handleNextPage() {
    if (page >= MAX_PAGES - 1) {
      return;
    }

    setPage(page + 1);
  }

  function handleFirstPage() {
    setPage(0);
  }

  function handleLastPage() {
    setPage(MAX_PAGES - 1);
  }

  return (
    <>
      <div className="flex w-full">
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex rounded-lg border border-secondary bg-neutral-focus">
            <input
              type="text"
              placeholder="Search word"
              className="my-3 rounded-lg border-none bg-transparent pl-4 pr-2 outline-none"
              ref={iwordenRef}
              onChange={searchForWord}
              name="searchword"
            />
            <button
              onClick={resetSearch}
              className={`pr-2 ${showReset ? "visible" : "invisible"}`}
            >
              {resetIcon}
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center space-y-2">
        {pageWords.map((e) => {
          return (
            <ListItem
              key={e.id}
              word={e}
              showTranslation={e.word == currentShown}
              clickHandler={
                props.enableClickingItems ? toggleCurrentShown : undefined
              }
              markHandler={props.markHandler}
              actions={props.actions}
              markLearned={props.markLearned}
            />
          );
        })}
      </div>
      <div className="flex items-center space-x-4 md:space-x-8">
        <button
          className="btn-ghost btn"
          onClick={handleFirstPage}
          disabled={page === 0}
        >
          {doubleChevronLeft}
        </button>
        <button
          className="btn-ghost btn"
          onClick={handlePrevPage}
          disabled={page < 1}
        >
          {chevronLeft}
        </button>
        <span>
          {page + 1} / {MAX_PAGES}
        </span>
        <button
          className="btn-ghost btn"
          onClick={handleNextPage}
          disabled={page >= MAX_PAGES - 1}
        >
          {chevronRight}
        </button>
        <button
          className="btn-ghost btn"
          onClick={handleLastPage}
          disabled={page == MAX_PAGES - 1}
        >
          {doubleChevronRight}
        </button>
      </div>
    </>
  );
}
