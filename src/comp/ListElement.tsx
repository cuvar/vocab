import { useState } from "react";
import { SwiperAction, InteractionEvent, ActionData } from "swiper-action";
import { uncheckedIcon, checkedIcon } from "../utils/icons";

interface IProps {
  word: ListElement;
  showTranslation: boolean;
  clickHandler: (eng: string) => void;
  markHandler?: (word: string, mark: boolean) => void;
  actions?: ActionData[];
}

const checkedColor = "text-green-600";
const uncheckedColor = "text-black-600";

export default function List(props: IProps) {
  const [markIcon, setMarkIcon] = useState<React.ReactNode>(
    props.word.learned ? checkedIcon : uncheckedIcon
  );
  const custom = !props.showTranslation ? "bg-white" : "bg-teal-200";
  const showMarkSigns = typeof props.markHandler !== "undefined";
  const [markColor, setMarkColor] = useState<string>(
    props.word.learned ? checkedColor : uncheckedColor
  );

  function toggleMark() {
    const marked = markIcon === checkedIcon ? false : true; // inverse because of delayed updates in setMarkIcon
    setMarkColor(markIcon === checkedIcon ? uncheckedColor : checkedColor); // inverse because of delayed updates in setMarkIcon
    setMarkIcon(markIcon === checkedIcon ? uncheckedIcon : checkedIcon);

    if (typeof props.markHandler !== "undefined") {
      props.markHandler(props.word.key, marked);
    }
  }

  function handleClick() {
    props.clickHandler(props.word.word);
  }

  const newActions = props.actions?.map((e) => {
    return {
      ...e,
      args: props.word,
    };
  });
  return (
    <div className={`w-full rounded-lg ${custom} text-black`}>
      <SwiperAction actions={newActions ?? []}>
        <div className={`flex h-full w-full items-center`}>
          <button
            onClick={handleClick}
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
                    {props.word.translation}
                    <br />
                    {props.word.notes.length > 0 && <p>{props.word.notes}</p>}
                  </span>
                </p>
              </div>
            )}
          </button>
          <div className="mx-4 flex items-center space-x-4">
            {props.word.c1business && <p>💼</p>}
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
