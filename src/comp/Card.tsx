import { type VocabularyFlashCard } from "~/server/domain/client/vocabularyFlashCard";

type Props = {
  word: VocabularyFlashCard;
  showBack: boolean;
  className?: string;
};

export default function Card(props: Props) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-black p-4 text-2xl text-base-100 ${
        !props.showBack ? "bg-white" : "bg-violet-200"
      } ${props.className ?? ""}`}
    >
      {(props.showBack && !props.word.switched) ||
      (props.word.switched && !props.showBack) ? (
        <div className="overflow- flex flex-col items-center overflow-hidden">
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">{props.word.iconBack}</div>
            <div>{props.word.back}</div>
          </div>
          <div className="flex flex-col space-y-2 text-base font-normal">
            <div>{props.word.notes}</div>
            {props.word.tags.length > 0 && (
              <div>{props.word.tags.map((e) => e.name).join(" ")}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center space-x-2 font-bold">
          <span>{props.word.iconFront}</span>
          <span>{props.word.front}</span>
        </div>
      )}
    </div>
  );
}
