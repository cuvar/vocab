import { api } from "../utils/api";
import List from "./List";
import Switch from "@mui/material/Switch";
import { useState } from "react";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const { data, isLoading } = api.word.getLearned.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWord) => {
        return {
          key: e.english,
          word: e.english,
          translation: e.german,
          ...e,
        };
      });
      setWordsToDisplay(transformed);
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!wordsToDisplay || !data) {
    return <div>no data</div>;
  }

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">Learned words: {data.length}</h1>
      <List words={wordsToDisplay}></List>
    </div>
  );
}
