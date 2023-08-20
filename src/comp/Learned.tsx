import { ActionData, InteractionEvent } from "swiper-action";
import { api } from "../utils/api";
import List from "./List";
import { useState } from "react";
import { trashIcon } from "../utils/icons";
import { Word } from "@prisma/client";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const markAsLearnedMutation = api.word.markAsLearned.useMutation({
    onSuccess: (data) => {
      getLearnedQuery.refetch();
    },
  });
  const getLearnedQuery = api.word.getLearned.useQuery(undefined, {
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

  if (getLearnedQuery.isLoading) {
    return <div>loading</div>;
  }

  if (!wordsToDisplay || !getLearnedQuery.data) {
    return <div>no data</div>;
  }

  function handleRemoveFromLearned(e: InteractionEvent, arg: VocabularyWord) {
    console.log("remove");
    console.log(e);
    console.log(arg.english);
    markAsLearnedMutation.mutate({
      word: arg.english,
      learned: false,
    });
  }

  const actions: ActionData[] = [
    {
      action: handleRemoveFromLearned,
      children: (
        <div className="flex h-full items-center justify-center bg-red-700 text-white">
          {trashIcon}
        </div>
      ),
    },
  ];

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">
        Learned words: {getLearnedQuery.data.length}
      </h1>
      <List words={wordsToDisplay} actions={actions}></List>
    </div>
  );
}
