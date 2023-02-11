import { useState } from "react";
import { api } from "../utils/api";

interface IProps {
  english: string;
  german: string;
  business: boolean;
  notes: string;
  showTranslation: boolean;
  clickHandler: (eng: string) => void;
}
export default function List(props: IProps) {
  const custom = !props.showTranslation ? "bg-white" : "bg-teal-200";

  return (
    <button
      className={`flex w-full justify-between rounded-lg py-4 px-4 text-center ${custom}`}
      onClick={() => props.clickHandler(props.english)}
    >
      {!props.showTranslation && <p>🏴󠁧󠁢󠁥󠁮󠁧󠁿 {props.english}</p>}
      {props.showTranslation && (
        <div className="flex flex-col text-left">
          <p>🇩🇪 {props.german}</p>
          {props.notes.length > 0 && <p>{props.notes}</p>}
        </div>
      )}
      {props.business && <p>💼</p>}
    </button>
  );
}
