import { useEffect, useState } from "react";
import { type ActionData } from "swiper-action";
import { AMOUNT_OF_WORDS_PER_PAGE } from "~/lib/const";
import {
  chevronLeft,
  chevronRight,
  doubleChevronLeft,
  doubleChevronRight,
} from "~/lib/ui/icons";
import { env } from "../env/client.mjs";
import type ListElement from "../server/domain/client/listElement";
import { searchWord } from "../server/service/client/search.service";
import Error from "../sites/Error";
import ListItem from "./ListItem";

type Props = {
  words: ListElement[];
  markHandler?: (word: string, mark: boolean) => void;
  actions?: ActionData[];
  markLearned?: boolean;
  enableClickingItems: boolean;
  showNative: boolean;
  searchString: string;
};

export default function List(props: Props) {
  const [currentShown, setCurrentShown] = useState("");
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [sorted, setSorted] = useState<ListElement[]>([]);
  const [page, setPage] = useState(0);
  const [pageWords, setPageWords] = useState(
    wordsToDisplay.slice(
      0 + page * AMOUNT_OF_WORDS_PER_PAGE,
      AMOUNT_OF_WORDS_PER_PAGE + page * AMOUNT_OF_WORDS_PER_PAGE
    )
  );

  const MAX_PAGES = Math.ceil(wordsToDisplay.length / AMOUNT_OF_WORDS_PER_PAGE);

  useEffect(() => {
    const sortedWords = props.words
      .sort((a, b) => a.word.localeCompare(b.word))
      .map((e) => transformForShowNative(props.showNative, e));

    setWordsToDisplay(sortedWords);
    setSorted(sortedWords);
  }, [props.words, props.showNative]);

  useEffect(() => {
    if (props.searchString.trim() == "") {
      setWordsToDisplay(sorted);
      return;
    }
    const words = searchWord(sorted, props.searchString);
    setWordsToDisplay(words.filter((r) => r !== null) as ListElement[]);
  }, [props.searchString]);

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

  function transformForShowNative(showNative: boolean, e: ListElement) {
    if (showNative) {
      return {
        ...e,
        word: e.otherWord,
        otherWord: e.word,
        iconNative: env.NEXT_PUBLIC_TRANSLATION_ICON,
        iconTranslation: env.NEXT_PUBLIC_NATIVE_ICON,
      };
    }
    return e;
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
