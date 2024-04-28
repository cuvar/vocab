import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { type ActionData, type InteractionEvent } from "swiper-action";
import { type FilterProps, type FilterState } from "../comp/Filter";
import FilterBar from "../comp/FilterBar";
import List from "../comp/List";
import Mutator from "../comp/Mutator";
import { api } from "../lib/api";
import { toListElement } from "../lib/helper";
import { useToast } from "../lib/ui/hooks";
import { archiveIcon, penIcon, resetIcon, switchIcon } from "../lib/ui/icons";
import { getAllWords, setAllWords } from "../lib/ui/store/allwords";
import { getArchivedWords, setArchivedWords } from "../lib/ui/store/archived";
import { getLearnedWords, setLearnedWords } from "../lib/ui/store/learned";
import { type ListElement } from "../server/domain/client/listElement";
import { type VocabularyWordData } from "../server/domain/client/vocabularyWord";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  wordToEditAtom,
} from "../server/store";
import Error from "./Error";
import Loading from "./Loading";

export default function AllWords() {
  const [filterState, setFilterState] = useState<FilterState>(null);
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>(
    getAllWords()
  );
  const [showNative, setShowNative] = useState<boolean>(false);
  const [searchString, setSearchString] = useState("");
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [refetchWords, setRefetchWords] = useAtom(refetchWordsAtom);

  const iwordenRef = useRef(null);

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
      const transformed: ListElement[] = data.map((e: VocabularyWordData) =>
        toListElement(e)
      );
      setWordsToDisplay(transformed);
      setAllWords(transformed);
    },
    refetchOnWindowFocus: false,
  });

  const getLearnedQuery = api.word.getLearned.useQuery(undefined, {
    onSuccess: (data) => {
      const transformed: ListElement[] = data.map((e: VocabularyWordData) =>
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
      const transformed: ListElement[] = data.map((e: VocabularyWordData) =>
        toListElement(e)
      );
      setWordsToDisplay(transformed);
      setArchivedWords(transformed);
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  function changeMarkAsLearned(ev: InteractionEvent, arg: VocabularyWordData) {
    updateModeMutation.mutate({
      id: arg.id,
      mode:
        arg.mode === LearnMode.LEARNED
          ? LearnMode.UNLEARNED
          : LearnMode.LEARNED,
    });
  }

  function archiveWord(ev: InteractionEvent, arg: VocabularyWordData) {
    updateModeMutation.mutate({
      id: arg.id,
      mode: LearnMode.ARCHIVED,
    });
  }

  function editWord(ev: InteractionEvent, arg: VocabularyWordData) {
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

  function resetSearch() {
    if (!iwordenRef.current) return;
    // eslint-disable-next-line
    // @ts-ignore
    iwordenRef.current.value = "";
    // setWordsToDisplay(sorted);
    setSearchString("");
  }

  function searchForWord() {
    if (!iwordenRef.current) {
      setSearchString("");
      return;
    }
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    const input = (iwordenRef.current.value ?? "") as string;

    if (input == "") {
      setSearchString("");
      return;
    }
    setSearchString(input);
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
      <div className="flex rounded-lg border border-secondary bg-neutral-focus">
        <input
          type="text"
          placeholder="Search word"
          className="my-3 rounded-lg border-none bg-transparent pl-4 pr-2 outline-none"
          ref={iwordenRef}
          onChange={searchForWord}
          name="searchword"
        />
        <button
          onClick={resetSearch}
          className={`pr-2 ${searchString.length ? "visible" : "invisible"}`}
        >
          {resetIcon}
        </button>
      </div>
      <List
        words={wordsToDisplay}
        actions={actions}
        markLearned={false}
        enableClickingItems={false}
        showNative={showNative}
        searchString={searchString}
      />
    </div>
  );
}
