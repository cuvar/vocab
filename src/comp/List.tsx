import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import ListElement from "./ListElement";

interface Word {
  english: string;
  german: string;
  c1business: boolean;
  notes: string;
}

export default function List() {
  const [currentShown, setCurrentShown] = useState("");
  const [showReset, setShowRest] = useState(false);
  const [wordsToDisplay, setWordsToDisplay] = useState<Word[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const iwordenRef = useRef(null);
  const learnedWordsQuery = api.word.getLearned.useQuery(
    // @ts-ignore
    {},
    { enabled: false }
  );

  useEffect(() => {
    if (allWords.length != 0) return;
    learnedWordsQuery.refetch().then((res) => {
      if (!res.data) return;
      const sorted = res.data.sort((a, b) =>
        a.english.localeCompare(b.english)
      );
      setAllWords(sorted);
      setWordsToDisplay(sorted);
    });
  }, [allWords]);

  // useEffect(() => {
  //   if (wordsToDisplay.length != 0) return;
  //   setWordsToDisplay(allWords);
  // }, [wordsToDisplay]);

  if (!learnedWordsQuery.data) {
    return <div>no data</div>;
  }

  function toggleCurrentShown(e: string) {
    if (currentShown != e) {
      setCurrentShown(e);
      return;
    }

    setCurrentShown("");
  }

  function searchForWord() {
    // @ts-ignore
    const input = iwordenRef.current?.value ?? "";
    if (input == "") {
      setWordsToDisplay(allWords);
      setShowRest(false);
      return;
    }

    setShowRest(true);
    const wordsToSearchThrough = allWords.map((word) => word.english);

    const fuse = new Fuse(wordsToSearchThrough, {
      includeScore: true,
      shouldSort: true,
    });

    const res = fuse.search(input).map((w) => w.item);
    const resultWordObjects: (Word | null)[] = res.map((r) => {
      const res = allWords.find((el) => el.english == r);
      if (res == undefined) return null;
      return res;
    });

    setWordsToDisplay(resultWordObjects.filter((r) => r !== null) as Word[]);
  }

  function resetSearch() {
    console.log(iwordenRef.current);
    if (!iwordenRef.current) return;
    // @ts-ignore
    iwordenRef.current.value = "";
    setWordsToDisplay(allWords);
  }

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">Your learned words</h1>
      <div className="flex">
        <div className="flex items-center rounded-lg bg-white">
          <input
            ref={iwordenRef}
            onChange={searchForWord}
            type="text"
            name="searchword"
            className="rounded-md py-2 px-2"
          />
          <button className="mr-2" onClick={searchForWord}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
        {showReset && (
          <button onClick={resetSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex w-full flex-col items-center space-y-2">
        {wordsToDisplay.map((e) => {
          return (
            <ListElement
              key={e.english}
              english={e.english}
              german={e.german}
              business={e.c1business}
              notes={e.notes}
              showTranslation={e.english == currentShown}
              clickHandler={toggleCurrentShown}
            />
          );
        })}
      </div>
    </div>
  );
}
