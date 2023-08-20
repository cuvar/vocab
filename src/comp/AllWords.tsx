import { useState } from "react";
import { api } from "../utils/api";
import List from "./List";
import { ActionData, InteractionEvent } from "swiper-action";
import { checkmarkIcon } from "../utils/icons";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const allQuery = api.word.getAll.useQuery(undefined, {
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
  const markAsLearnedQuery = api.word.markAsLearned.useMutation({
    onSuccess: () => {
      allQuery.refetch();
    },
  });

  if (allQuery.isLoading) {
    return <div>loading</div>;
  }

  if (!allQuery.data) {
    return <div>no data</div>;
  }

  function markAsLearned(ev: InteractionEvent, arg: VocabularyWord) {
    markAsLearnedQuery.mutate({
      word: arg.english,
      learned: true,
    });
  }

  const actions: ActionData[] = [
    {
      action: markAsLearned,
      children: (
        <div className="flex h-full items-center justify-center bg-green-700 text-white">
          {checkmarkIcon}
        </div>
      ),
    },
  ];

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">
        All words: {allQuery.data.length}
      </h1>
      <List words={wordsToDisplay} actions={actions}></List>
    </div>
  );
}
