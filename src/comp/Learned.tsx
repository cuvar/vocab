import { api } from "../utils/api";
import List from "./List";
import Switch from "@mui/material/Switch";
import { useState } from "react";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const { data, isLoading } = api.word.getLearned.useQuery(
    // @ts-ignore
    {},
    {
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
    }
  );

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!wordsToDisplay) {
    return <div>no data</div>;
  }

  function handleSwitchChange() {
    const newChecked = !switchChecked;
    setSwitchChecked(newChecked);
    if (newChecked) {
      // show german
      const transformed: ListElement[] = wordsToDisplay.map((e) => {
        return {
          word: e.translation,
          translation: e.word,
          key: e.english,
          notes: e.notes,
          learned: e.learned,
          c1business: e.c1business,
          english: e.english,
          german: e.german,
        };
      });
      setWordsToDisplay(transformed);
    } else {
      // show english
      const transformed: ListElement[] = wordsToDisplay.map((e) => {
        return {
          word: e.translation,
          translation: e.word,
          key: e.english,
          notes: e.notes,
          learned: e.learned,
          c1business: e.c1business,
          english: e.english,
          german: e.german,
        };
      });
      setWordsToDisplay(transformed);
    }
  }

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">Learned words: {data.length}</h1>
      <div className="flex items-center">
        <p>German</p>
        <Switch
          color="secondary"
          onChange={handleSwitchChange}
          checked={switchChecked}
        />
      </div>
      <List words={wordsToDisplay}></List>
    </div>
  );
}
