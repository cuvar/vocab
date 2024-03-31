import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { type ActionData, type InteractionEvent } from "swiper-action";
import { type FilterProps, type FilterState } from "../comp/Filter";
import FilterBar from "../comp/FilterBar";
import List from "../comp/List";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  wordToEditAtom,
} from "../server/store";
import { type ListElement, type VocabularyWord } from "../types/types";
import { api } from "../utils/api";
import { toListElement } from "../utils/helper";
import { useToast } from "../utils/hooks";
import { penIcon, switchIcon, trashIcon } from "../utils/icons";
import { getAllWords, setAllWords } from "../utils/store/allwords";
import { getArchivedWords, setArchivedWords } from "../utils/store/archived";
import { getLearnedWords, setLearnedWords } from "../utils/store/learned";
import Error from "./Error";
import Loading from "./Loading";

export default function AllWords() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>(
    getAllWords()
  );
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [refetchWords, setRefetchWords] = useAtom(refetchWordsAtom);

  const showToast = useToast();

  const filter: FilterProps[] = [
    {
      state: "learned",
      text: "Learned",
    },
    {
      state: "archived",
      text: "Archived",
    },
  ];

  const updateModeMutation = api.word.updateMode.useMutation({
    onSuccess: (data) =>
      showToast(`"${data.translation}" (un)marked successfully`, "success"),
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const deleteWordMutation = api.word.deleteWord.useMutation({
    onSuccess: (data) =>
      showToast(`"${data.translation}" was deleted successfully`, "success"),
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const getAllQuery = api.word.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWord) =>
        toListElement(e)
      );
      setWordsToDisplay(transformed);
      setAllWords(transformed);
    },
    refetchOnWindowFocus: false,
  });

  const getLearnedQuery = api.word.getLearned.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWord) =>
        toListElement(e)
      );
      setWordsToDisplay(transformed);
      setLearnedWords(transformed);
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const getArchivedQuery = api.word.getArchived.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWord) =>
        toListElement(e)
      );
      setWordsToDisplay(transformed);
      setArchivedWords(transformed);
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

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
  ];

  function handleFilterChanged(filterState: FilterState) {
    if (filterState === "learned") {
      const words = getLearnedWords();
      if (words.length === 0) {
        void getLearnedQuery.refetch();
        return;
      }
      setWordsToDisplay(words);
    } else if (filterState === "archived") {
      const words = getArchivedWords();
      if (words.length === 0) {
        void getArchivedQuery.refetch();
        return;
      }
      setWordsToDisplay(words);
    } else {
      const words = getAllWords();
      if (words.length === 0) {
        void getAllQuery.refetch();
        return;
      }
      setWordsToDisplay(words);
    }
  }

  useEffect(() => {
    if (refetchWords) {
      setRefetchWords(false);
      void (async () => {
        await getAllQuery.refetch();
      })();
    }
  }, [getAllQuery, refetchWords, setRefetchWords]);

  if (getAllQuery.isLoading) {
    return <Loading />;
  }

  if (!wordsToDisplay) {
    return <Error msg={"No data available"} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">
        {wordsToDisplay.length} words
      </h1>
      <FilterBar filter={filter} onChange={handleFilterChanged} />
      <List
        words={wordsToDisplay}
        actions={actions}
        markLearned={false}
        enableClickingItems={false}
      />
    </div>
  );
}
