import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import ListElement from "./ListElement";
import { resetIcon } from "../utils/icons";
import { ActionData } from "swiper-action";
import Error from "./Error";

interface IProps {
  words: ListElement[];
  markHandler?: (word: string, mark: boolean) => void;
  actions?: ActionData[];
  markLearned?: boolean;
}

export default function List(props: IProps) {
  const sorted = props.words.sort((a, b) => a.word.localeCompare(b.word));

  const [currentShown, setCurrentShown] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [wordsToDisplay, setWordsToDisplay] = useState(sorted);
  const [switchChecked, setSwitchChecked] = useState(false);
  const iwordenRef = useRef(null);

  useEffect(() => {
    setWordsToDisplay(sorted);
  }, [sorted]);

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

  function handleSwitchChange() {
    const newChecked = !switchChecked;
    setSwitchChecked(newChecked);
    if (newChecked) {
      // show german
      const transformed: ListElement[] = wordsToDisplay.map((e) => {
        return {
          id: e.id,
          word: e.otherWord,
          otherWord: e.word,
          key: e.translation,
          notes: e.notes,
          learned: e.learned,
          c1business: e.c1business,
          translation: e.translation,
          native: e.native,
          iconNative: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          iconTranslation: "🇩🇪",
        };
      });
      setWordsToDisplay(transformed);
    } else {
      // show english
      const transformed: ListElement[] = wordsToDisplay.map((e) => {
        return {
          id: e.id,
          word: e.otherWord,
          otherWord: e.word,
          key: e.translation,
          notes: e.notes,
          learned: e.learned,
          c1business: e.c1business,
          translation: e.translation,
          native: e.native,
          iconNative: "🇩🇪",
          iconTranslation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        };
      });
      setWordsToDisplay(transformed);
    }
  }

  return (
    <>
      <div className="flex w-full">
        <div className="mx-4 flex w-full flex-wrap items-center justify-between">
          <label className="label mr-4 flex cursor-pointer space-x-2">
            <input
              type="checkbox"
              checked={switchChecked}
              className="checkbox"
              onChange={handleSwitchChange}
            />
            <span className="label-text">Show native</span>
          </label>
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
        {wordsToDisplay.map((e) => {
          return (
            <ListElement
              key={e.key}
              word={e}
              showTranslation={e.word == currentShown}
              clickHandler={toggleCurrentShown}
              markHandler={props.markHandler}
              actions={props.actions}
              markLearned={props.markLearned}
            />
          );
        })}
      </div>
    </>
  );
}
