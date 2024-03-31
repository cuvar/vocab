import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { type ActionData, type InteractionEvent } from "swiper-action";
import { type FilterProps, type FilterState } from "../comp/Filter";
import FilterBar from "../comp/FilterBar";
import List from "../comp/List";
import Mutator from "../comp/Mutator";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  wordToEditAtom,
} from "../server/store";
import { type ListElement, type VocabularyWord } from "../types/types";
import { api } from "../utils/api";
import { toListElement } from "../utils/helper";
import { useToast } from "../utils/hooks";
import { archiveIcon, penIcon, switchIcon } from "../utils/icons";
import { getAllWords, setAllWords } from "../utils/store/allwords";
import { getArchivedWords, setArchivedWords } from "../utils/store/archived";
import { getLearnedWords, setLearnedWords } from "../utils/store/learned";
import Error from "./Error";
import Loading from "./Loading";

export default function AllWords() {
  const [filterState, setFilterState] = useState<FilterState>(null);
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>(
    getAllWords()
  );
  const [showNative, setShowNative] = useState<boolean>(false);
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

  function archiveWord(ev: InteractionEvent, arg: VocabularyWord) {
    updateModeMutation.mutate({
      id: arg.id,
      mode: LearnMode.ARCHIVED,
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
      action:
        filterState === "learned"
          ? archiveWord
          : filterState === "archived"
          ? changeMarkAsLearned
          : changeMarkAsLearned,
      children: (
        <div className="flex h-full items-center justify-center bg-accent text-white">
          {filterState === "learned"
            ? archiveIcon
            : filterState === "archived"
            ? switchIcon
            : switchIcon}
        </div>
      ),
    },
  ];

  function handleFilterChanged(newFilterState: FilterState) {
    setFilterState(newFilterState);

    if (newFilterState === "learned") {
      const words = getLearnedWords();
      if (words.length === 0) {
        void getLearnedQuery.refetch();
        return;
      }
      setWordsToDisplay(words);
    } else if (newFilterState === "archived") {
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

  function handleShowNativeChanged() {
    const newShowNative = !showNative;
    setShowNative(newShowNative);
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
      <div className="flex w-full flex-col space-y-4">
        <FilterBar filter={filter} onChange={handleFilterChanged} />
        <div className="flex w-full space-x-4 overflow-y-scroll">
          <Mutator
            id={"showNative"}
            text={"Show Native"}
            onclick={handleShowNativeChanged}
            active={showNative}
          />
        </div>
      </div>
      <List
        words={wordsToDisplay}
        actions={actions}
        markLearned={false}
        enableClickingItems={false}
        showNative={showNative}
      />
    </div>
  );
}
