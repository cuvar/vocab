import { useState } from "react";
import { api } from "../utils/api";
import List from "./List";
import { ActionData, InteractionEvent } from "swiper-action";
import { checkmarkIcon } from "../utils/icons";
import Toast from "./Toast";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [toastText, setToastText] = useState("");
  const [toastMode, setToastMode] = useState<ToastType>("success");
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
    onSuccess: (data) => {
      setToastMode("success");
      setToastText(`"${data.english}" added to learned words`);
      allQuery.refetch();
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
    onError: (err) => {
      setToastMode("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
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
      <Toast msg={toastText} mode={toastMode} visible={toastText.length > 0} />
    </div>
  );
}
