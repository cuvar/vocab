import { LearnMode } from "@prisma/client";
import { useState } from "react";
import {
  SwiperAction,
  type ActionData,
  type InteractionEvent,
} from "swiper-action";
import { type ListElement } from "../types/types";
import { checkedIcon, uncheckedIcon } from "../utils/icons";

type Props = {
  word: ListElement;
  showTranslation: boolean;
  clickHandler?: (eng: string) => void;
  markHandler?: (word: string, mark: boolean) => void;
  actions?: ActionData[];
  markLearned?: boolean;
};

const checkedColor = "text-green-600";
const uncheckedColor = "text-black-600";

export default function ListItem(props: Props) {
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [markIcon, setMarkIcon] = useState<React.ReactNode>(
    props.word.mode == LearnMode.LEARNED ? checkedIcon : uncheckedIcon
  );
  const showTranslationClass = !props.showTranslation
    ? "bg-white"
    : "bg-violet-200";
  const learnedClass =
    props.word.mode == LearnMode.LEARNED && props.markLearned
      ? "border border-4 border-secondary"
      : "";
  const showMarkSigns = typeof props.markHandler !== "undefined";
  const [markColor, setMarkColor] = useState<string>(
    props.word.mode == LearnMode.LEARNED ? checkedColor : uncheckedColor
  );

  function toggleMark() {
    const marked = markIcon === checkedIcon ? false : true; // inverse because of delayed updates in setMarkIcon
    setMarkColor(markIcon === checkedIcon ? uncheckedColor : checkedColor); // inverse because of delayed updates in setMarkIcon
    setMarkIcon(markIcon === checkedIcon ? uncheckedIcon : checkedIcon);

    if (typeof props.markHandler !== "undefined") {
      props.markHandler(props.word.id, marked);
    }
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (isSwiping) return;

    if (props.clickHandler) {
      props.clickHandler(props.word.word);
    }
  }

  function handleSwipeStart(e: InteractionEvent) {
    setIsSwiping(true);
  }

  function handleSwipeEnd(e: InteractionEvent) {
    setIsSwiping(false);
  }

  function handleResetStart(e: Event) {
    setIsSwiping(true);
  }

  function handleResetEnd(e: Event) {
    setIsSwiping(false);
  }

  const newActions = props.actions?.map((e) => {
    return {
      ...e,
      args: props.word,
    };
  });
  return (
    <div
      className={`w-full rounded-lg ${showTranslationClass} ${learnedClass} text-black`}
    >
      <SwiperAction
        actions={newActions ?? []}
        onSwipeStart={handleSwipeStart}
        onSwipeEnd={handleSwipeEnd}
        onResetStart={handleResetStart}
        onResetEnd={handleResetEnd}
      >
        <div className={`flex h-full w-full items-center`}>
          <button
            onClick={(e) => handleClick(e)}
            className="w-full rounded-lg py-4 px-4 text-left"
          >
            {!props.showTranslation && (
              <p className="flex items-center space-x-2">
                <span>{props.word.iconTranslation}</span>
                <span>{props.word.word}</span>
              </p>
            )}
            {props.showTranslation && (
              <div className="flex flex-col text-left">
                <p className="flex items-center space-x-2">
                  <span>{props.word.iconNative}</span>
                  <span>
                    {props.word.otherWord}
                    <br />
                    {props.word.notes.length > 0 && (
                      <span>{props.word.notes}</span>
                    )}
                  </span>
                </p>
              </div>
            )}
          </button>
          <div className="mx-4 flex items-center space-x-4">
            {props.word.tags.length > 0 && (
              <div className="flex space-x-2">
                {props.word.tags.map((tag) => (
                  <span key={tag.name}>{tag.name}</span>
                ))}
              </div>
            )}
            {showMarkSigns && (
              <button className={`${markColor}`} onClick={toggleMark}>
                {markIcon}
              </button>
            )}
          </div>
        </div>
      </SwiperAction>
    </div>
  );
}
