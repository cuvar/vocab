import { useState } from "react";

interface IProps {
  word: VocabularyWord;
  showTranslation: boolean;
  clickHandler: (eng: string) => void;
  markHandler?: (word: string, mark: boolean) => void;
}

const checked = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-10 w-10"
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);
const unchecked = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1}
    stroke="currentColor"
    className="h-10 w-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const checkedColor = "text-green-600";
const uncheckedColor = "text-black-600";

export default function List(props: IProps) {
  const [markIcon, setMarkIcon] = useState<React.ReactNode>(
    props.word.learned ? checked : unchecked
  );
  const custom = !props.showTranslation ? "bg-white" : "bg-teal-200";
  const showMarkSigns = typeof props.markHandler !== "undefined";
  const [markColor, setMarkColor] = useState<string>(
    props.word.learned ? checkedColor : uncheckedColor
  );

  function toggleMark() {
    const marked = markIcon === checked ? false : true; // inverse because of delayed updates in setMarkIcon
    setMarkColor(markIcon === checked ? uncheckedColor : checkedColor); // inverse because of delayed updates in setMarkIcon
    setMarkIcon(markIcon === checked ? unchecked : checked);

    if (typeof props.markHandler !== "undefined") {
      props.markHandler(props.word.english, marked);
    }
  }
  return (
    <div
      className={`flex w-full items-center justify-between rounded-lg text-center ${custom}`}
    >
      <button
        onClick={() => props.clickHandler(props.word.english)}
        className="h-full w-full rounded-lg py-4 px-4 text-left"
      >
        {!props.showTranslation && <p>🏴󠁧󠁢󠁥󠁮󠁧󠁿 {props.word.english}</p>}
        {props.showTranslation && (
          <div className="flex flex-col text-left">
            <p>🇩🇪 {props.word.german}</p>
            {props.word.notes.length > 0 && <p>{props.word.notes}</p>}
          </div>
        )}
      </button>
      <div className="mx-4 flex h-full items-center space-x-4">
        {props.word.c1business && <p>💼</p>}
        {showMarkSigns && (
          <button className={`${markColor}`} onClick={toggleMark}>
            {markIcon}
          </button>
        )}
      </div>
    </div>
  );
}
