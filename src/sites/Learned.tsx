import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { type ActionData, type InteractionEvent } from "swiper-action";
import List from "../comp/List";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import { type ListElement, type VocabularyWord } from "../types/types";
import { api } from "../utils/api";
import { crossIcon, penIcon } from "../utils/icons";
import Error from "./Error";
import Loading from "./Loading";

export default function Learned() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [refetchWords, setRefetchWords] = useAtom(refetchWordsAtom);

  const updateModeMutation = api.word.updateMode.useMutation({
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

  useEffect(() => {
    if (refetchWords) {
      setRefetchWords(false);
      void (async () => {
        await getLearnedQuery.refetch();
      })();
    }
  }, [getLearnedQuery, refetchWords, setRefetchWords]);

  if (getLearnedQuery.isLoading) {
    return <Loading />;
  }

  if (!wordsToDisplay || !getLearnedQuery.data) {
    return <Error msg={"No data available"} />;
  }

  function handleRemoveFromLearned(e: InteractionEvent, arg: VocabularyWord) {
    updateModeMutation.mutate({
      id: arg.id,
      mode: LearnMode.UNLEARNED,
    });
  }

  function editWord(ev: InteractionEvent, arg: VocabularyWord) {
    setWordToEdit(arg);
    setShowEditorModal(true);
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
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">
        Learned words: {getLearnedQuery.data.length}
      </h1>
      <List
        words={wordsToDisplay}
        actions={actions}
        enableClickingItems={false}
      ></List>
    </div>
  );
}
