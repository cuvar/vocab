import { useState } from "react";
import { SwiperAction, Action, InteractionEvent } from "swiper-action";
import { uncheckedIcon, checkedIcon } from "../utils/icons";

interface IProps {
  word: ListElement;
  showTranslation: boolean;
  clickHandler: (eng: string) => void;
  markHandler?: (word: string, mark: boolean) => void;
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

  function handleClick(e: InteractionEvent) {
    console.log(e.target);
  }

  const actions = [
    <Action action={(e) => handleClick(e)} key={1}>
      <div className="flex h-full flex-col justify-center bg-red-300">
        action
      </div>
    </Action>,
    <Action action={(e) => handleClick(e)} key={2}>
      <div className="flex h-full flex-col justify-center bg-green-300">
        action2
      </div>
    </Action>,
  ];
  return (
    <div className={`w-full rounded-lg ${custom} text-black`}>
      <SwiperAction actions={actions}>
        <div className={`flex h-full w-full items-center`}>
          <button
            // onClick={() => props.clickHandler(props.word.word)}
            className="w-full rounded-lg py-4 px-4 text-left"
          >
            {!props.showTranslation && <p>🏴󠁧󠁢󠁥󠁮󠁧󠁿 {props.word.word}</p>}
            {props.showTranslation && (
              <div className="flex flex-col text-left">
                <p>🇩🇪 {props.word.translation}</p>
                {props.word.notes.length > 0 && <p>{props.word.notes}</p>}
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
