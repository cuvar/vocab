import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { type ActionData, type InteractionEvent } from "swiper-action";
import Filter from "../comp/Filter";
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
import { crossIcon, penIcon, switchIcon, trashIcon } from "../utils/icons";
import { getAllWords, setAllWords } from "../utils/store/allwords";
import Error from "./Error";
import Loading from "./Loading";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>(
    getAllWords()
  );
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [refetchWords, setRefetchWords] = useAtom(refetchWordsAtom);

  const allQuery = api.word.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWord) => {
        return {
          word: e.translation,
          otherWord: e.native,
          ...e,
        };
      });
      setWordsToDisplay(transformed);
      setAllWords(transformed);
    },
    refetchOnWindowFocus: false,
  });

  const updateModeMutation = api.word.updateMode.useMutation({
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

  // const getLearnedQuery = api.word.getLearned.useQuery(undefined, {
  //   onSuccess: (data) => {
  //     const transformed: ListElement[] = data.map((e: VocabularyWord) => {
  //       return {
  //         word: e.translation,
  //         otherWord: e.native,
  //         ...e,
  //       };
  //     });
  //     setWordsToDisplay(transformed);
  //     setLearnedWords(transformed);
  //   },
  //   refetchOnWindowFocus: false,
  //   enabled: false,
  // });

  useEffect(() => {
    if (refetchWords) {
      setRefetchWords(false);
      void (async () => {
        await allQuery.refetch();
        // await getLearnedQuery.refetch();
      })();
    }
  }, [allQuery, refetchWords, setRefetchWords]);

  if (allQuery.isLoading) {
    return <Loading />;
  }

  if (!allQuery.data) {
    return <Error msg={"No data available"} />;
  }

  function handleRemoveFromLearned(e: InteractionEvent, arg: VocabularyWord) {
    updateModeMutation.mutate({
      id: arg.id,
      mode: LearnMode.UNLEARNED,
    });
  }

  function changeMarkAsLearned(ev: InteractionEvent, arg: VocabularyWord) {
    updateModeMutation.mutate({
      id: arg.id,
      mode:
        arg.mode === LearnMode.LEARNED
          ? LearnMode.UNLEARNED
          : LearnMode.LEARNED,
    });
  }

  function deleteWord(ev: InteractionEvent, arg: VocabularyWord) {
    deleteWordMutation.mutate({ id: arg.id });
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
        All words: {allQuery.data.length}
      </h1>
      <div className="flex w-full space-x-4 overflow-y-scroll">
        <Filter text={"Learned"} onclick={() => console.log("Learned")} />
        <Filter text={"Archived"} onclick={() => console.log("Archived")} />
      </div>
      <List
        words={wordsToDisplay}
        actions={actions}
        markLearned={true}
        enableClickingItems={false}
      />
    </div>
  );
}
