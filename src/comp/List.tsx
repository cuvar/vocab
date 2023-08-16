import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import ListElement from "./ListElement";
import { resetIcon, searchIcon } from "../utils/icons";

interface IProps {
  words: ListElement[];
  markHandler?: (word: string, mark: boolean) => void;
}

export default function List(props: IProps) {
  const sorted = props.words.sort((a, b) => a.word.localeCompare(b.word));

  const [currentShown, setCurrentShown] = useState("");
  const [showReset, setShowReset] = useState(false);
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
      setShowReset(false);
      return;
    }

    setShowReset(true);
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
    setShowReset(false);
  }

  return (
    <>
      <div className="flex">
        <div className="flex items-center space-x-4 rounded-lg">
          <input
            type="text"
            placeholder="Your word"
            className="input-bordered input-secondary input w-full max-w-xs"
            ref={iwordenRef}
            onChange={searchForWord}
            name="searchword"
          />
          <button className="mr-2" onClick={searchForWord}>
            {searchIcon}
          </button>
        </div>
        {showReset && (
          <button onClick={resetSearch} className="ml-2">
            {resetIcon}
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
