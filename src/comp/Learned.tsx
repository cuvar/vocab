import { ActionData, InteractionEvent } from "swiper-action";
import { api } from "../utils/api";
import List from "./List";
import { useState } from "react";
import { crossIcon } from "../utils/icons";
import { useAtom } from "jotai";
import { toastTextAtom, toastTypeAtom } from "../server/store";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [toastText, setToastText] = useAtom(toastTextAtom);
  const [toastType, setToastType] = useAtom(toastTypeAtom);

  const markAsLearnedMutation = api.word.markAsLearned.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.english}" removed from learned words`);
      getLearnedQuery.refetch();
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
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
    markAsLearnedMutation.mutate({
      word: arg.english,
      learned: false,
    });
  }

  const actions: ActionData[] = [
    {
      action: handleRemoveFromLearned,
      children: (
        <div className="flex h-full items-center justify-center bg-error text-white">
          {crossIcon}
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">
        Learned words: {getLearnedQuery.data.length}
      </h1>
      <List words={wordsToDisplay} actions={actions}></List>
    </div>
  );
}
