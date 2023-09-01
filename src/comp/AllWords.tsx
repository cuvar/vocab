import { useState } from "react";
import { api } from "../utils/api";
import List from "./List";
import { ActionData, InteractionEvent } from "swiper-action";
import { switchIcon, trashIcon } from "../utils/icons";
import { useAtom } from "jotai";
import { toastTextAtom, toastTypeAtom } from "../server/store";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [toastText, setToastText] = useAtom(toastTextAtom);
  const [toastType, setToastType] = useAtom(toastTypeAtom);

  const allQuery = api.word.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWord) => {
        return {
          key: e.translation,
          word: e.translation,
          otherWord: e.native,
          ...e,
        };
      });
      setWordsToDisplay(transformed);
    },
    refetchOnWindowFocus: false,
  });
  const markAsLearnedQuery = api.word.markAsLearned.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" (un)marked successfully`);
      allQuery.refetch();
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
  const deleteWordMutation = api.word.deleteWord.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" was deleted successfully`);
      allQuery.refetch();
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

  if (allQuery.isLoading) {
    return <div>loading</div>;
  }

  if (!allQuery.data) {
    return <div>no data</div>;
  }

  function changeMarkAsLearned(ev: InteractionEvent, arg: VocabularyWord) {
    markAsLearnedQuery.mutate({
      id: arg.id,
      learned: !arg.learned,
    });
  }

  function deleteWord(ev: InteractionEvent, arg: VocabularyWord) {
    deleteWordMutation.mutate({ id: arg.id });
  }

  const actions: ActionData[] = [
    {
      action: changeMarkAsLearned,
      children: (
        <div className="flex h-full items-center justify-center bg-accent text-white">
          {switchIcon}
        </div>
      ),
    },
    {
      action: deleteWord,
      children: (
        <div className="flex h-full items-center justify-center bg-error text-white">
          {trashIcon}
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">
        All words: {allQuery.data.length}
      </h1>
      <List words={wordsToDisplay} actions={actions} markLearned={true} />
    </div>
  );
}
