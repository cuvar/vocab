import { useAtom } from "jotai";
import { useState } from "react";
import { ActionData, InteractionEvent } from "swiper-action";
import {
  modalIdAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import { api } from "../utils/api";
import { penIcon, switchIcon, trashIcon } from "../utils/icons";
import Error from "./Error";
import List from "./List";
import Loading from "./Loading";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [toastText, setToastText] = useAtom(toastTextAtom);
  const [toastType, setToastType] = useAtom(toastTypeAtom);
  const [modalId, __] = useAtom(modalIdAtom);
  const [wordToEdit, setWordToEdit] = useAtom(wordToEditAtom);

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
      void (async () => {
        await allQuery.refetch();
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
  const deleteWordMutation = api.word.deleteWord.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" was deleted successfully`);
      void (async () => {
        await allQuery.refetch();
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

  if (allQuery.isLoading) {
    return <Loading />;
  }

  if (!allQuery.data) {
    return <Error msg={"No data available"} />;
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
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">
        All words: {allQuery.data.length}
      </h1>
      <List words={wordsToDisplay} actions={actions} markLearned={true} />
    </div>
  );
}
