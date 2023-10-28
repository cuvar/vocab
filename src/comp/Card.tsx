import { type VocabularyWord } from "../types/types";

type Props = {
  word: VocabularyWord;
  showNative: boolean;
  className?: string;
};

export default function Card(props: Props) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-black p-4 text-2xl text-base-100 ${
        !props.showNative ? "bg-white" : "bg-violet-200"
      } ${props.className ?? ""}`}
    >
      {props.showNative ? (
        <div className="flex flex-col items-center overflow-hidden">
          <div className="flex justify-center space-x-2">
            <div>{props.word.iconNative}</div>
            <div>{props.word.native}</div>
          </div>
          <div className="flex flex-col space-y-2 text-base font-normal">
            <div>{props.word.notes}</div>
            {props.word.c1business && <div className="">💼</div>}
          </div>
        </div>
      ) : (
        <div className="flex justify-center space-x-2 font-bold">
          <span>{props.word.iconTranslation}</span>
          <span>{props.word.translation}</span>
        </div>
      )}
    </div>
  );
}
