import { useState } from "react";
import { api } from "../utils/api";
import List from "./List";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const allQuery = api.word.getAll.useQuery(
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
  const markAsLearnedQuery = api.word.markAsLearned.useMutation();

  if (allQuery.isLoading) {
    return <div>loading</div>;
  }

  if (!allQuery.data) {
    return <div>no data</div>;
  }

  function markAsLearned(word: string, mark: boolean) {
    markAsLearnedQuery.mutate({
      word: word,
      learned: mark,
    });
    allQuery.refetch();
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
      <h1 className="text-2xl tracking-tight">
        All words: {allQuery.data.length}
      </h1>
      <List
        words={wordsToDisplay}
        markHandler={(w: string, m: boolean) => markAsLearned(w, m)}
      ></List>
    </div>
  );
}
