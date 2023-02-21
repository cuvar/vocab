import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import ListElement from "./ListElement";

interface IProps {
  words: ListElement[];
  markHandler?: (word: string, mark: boolean) => void;
}

export default function List(props: IProps) {
  const sorted = props.words.sort((a, b) => a.word.localeCompare(b.word));

  const [currentShown, setCurrentShown] = useState("");
  const [showReset, setShowRest] = useState(false);
  const [wordsToDisplay, setWordsToDisplay] = useState(sorted);
  const iwordenRef = useRef(null);

  useEffect(() => {
    setWordsToDisplay(sorted);
  }, [sorted]);

  if (sorted.length === 0) {
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
      setWordsToDisplay(sorted);
      setShowRest(false);
      return;
    }

    setShowRest(true);
    const wordsToSearchThrough = sorted.map((word) => word.word);

    const fuse = new Fuse(wordsToSearchThrough, {
      includeScore: true,
      shouldSort: true,
    });

    const res = fuse.search(input).map((w) => w.item);
    const resultWordObjects: (ListElement | null)[] = res.map((r) => {
      const res = sorted.find((el) => el.word == r);
      if (res == undefined) return null;
      return res;
    });

    setWordsToDisplay(
      resultWordObjects.filter((r) => r !== null) as ListElement[]
    );
  }

  function resetSearch() {
    if (!iwordenRef.current) return;
    // @ts-ignore
    iwordenRef.current.value = "";
    setWordsToDisplay(sorted);
    setShowRest(false);
  }

  return (
    <>
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
          <button onClick={resetSearch} className="ml-2">
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
              key={e.key}
              word={e}
              showTranslation={e.word == currentShown}
              clickHandler={toggleCurrentShown}
              markHandler={props.markHandler}
            />
          );
        })}
      </div>
    </>
  );
}
