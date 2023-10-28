import { useAtom } from "jotai";
import { useState } from "react";
import { type ActionData, type InteractionEvent } from "swiper-action";
import {
  modalIdAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import { type ListElement, type VocabularyWord } from "../types/types";
import { api } from "../utils/api";
import { crossIcon, penIcon } from "../utils/icons";
import Error from "./Error";
import List from "./List";
import Loading from "./Loading";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [modalId] = useAtom(modalIdAtom);

  const markAsLearnedMutation = api.word.markAsLearned.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" removed from learned words`);
      void (async () => {
          await getLearnedQuery.refetch();
      })();
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
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
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
