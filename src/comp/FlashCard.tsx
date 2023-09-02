import { useState } from "react";
import Card from "./Card";
import { thumbsDownIcon, thumbsUpIcon } from "../utils/icons";

type Props = {
  word: VocabularyWord;
};

export default function FlashCard(props: Props) {
  const [showNative, setShowNative] = useState(false);

  function toggleShowNative() {
    setShowNative(!showNative);
  }

  function handleGood() {
    console.log("good");
  }

  function handleBad() {
    console.log("bad");
  }

  return (
    <div className="my-5 flex w-full max-w-[24rem] flex-col items-center space-y-4">
      <div onClick={toggleShowNative} className="h-60 w-full">
        <Card word={props.word} showNative={showNative} />
      </div>
      <div className="flex w-full items-stretch justify-evenly space-x-4 text-black">
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
    </div>
  );
}
