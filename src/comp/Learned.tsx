import { ActionData, InteractionEvent } from "swiper-action";
import { api } from "../utils/api";
import List from "./List";
import { useState } from "react";
import { crossIcon, penIcon } from "../utils/icons";
import { useAtom } from "jotai";
import {
  modalIdAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import Loading from "./Loading";
import Error from "./Error";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [toastText, setToastText] = useAtom(toastTextAtom);
  const [toastType, setToastType] = useAtom(toastTypeAtom);
  const [wordToEdit, setWordToEdit] = useAtom(wordToEditAtom);
  const [modalId, __] = useAtom(modalIdAtom);

  const markAsLearnedMutation = api.word.markAsLearned.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" removed from learned words`);
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

  if (getLearnedQuery.isLoading) {
    return <Loading />;
  }

  if (!wordsToDisplay || !getLearnedQuery.data) {
    return <Error msg={"No data available"} />;
  }

  function handleRemoveFromLearned(e: InteractionEvent, arg: VocabularyWord) {
    markAsLearnedMutation.mutate({
      id: arg.id,
      learned: false,
    });
  }

  function editWord(ev: InteractionEvent, arg: VocabularyWord) {
    setWordToEdit(arg);
    // @ts-ignore
    window[modalId].showModal();
  }

  const actions: ActionData[] = [
    {
      action: editWord,
      children: (
        <div className="flex h-full items-center justify-center bg-teal-500 text-white">
          {penIcon}
        </div>
      ),
    },
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
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">
        Learned words: {getLearnedQuery.data.length}
      </h1>
      <List words={wordsToDisplay} actions={actions}></List>
    </div>
  );
}
