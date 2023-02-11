import { useState } from "react";
import { api } from "../utils/api";
import ListElement from "./ListElement";

export default function List() {
  const { data, error, isLoading } = api.word.getLearned.useQuery();
  const [currentShown, setCurrentShown] = useState("");

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  const sorted = data.sort((a, b) => a.english.localeCompare(b.english));

  function toggleCurrentShown(e: string) {
    setCurrentShown(e);
  }
  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">Your learned words</h1>
      <div className="flex w-full flex-col items-center space-y-2">
        {sorted.map((e) => {
          return (
            <ListElement
              english={e.english}
              german={e.german}
              business={e.c1business}
              notes={e.notes}
              showTranslation={e.english == currentShown}
              clickHandler={toggleCurrentShown}
            />
          );
        })}
      </div>
    </div>
  );
}
