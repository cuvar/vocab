import { useState } from "react";
import { api } from "../utils/api";
import Loading from "./Loading";
import Error from "./Error";
import FlashCard from "./FlashCard";

export default function FlashCards() {
  const [wordsToDisplay, setWordsToDisplay] = useState<ListElement[]>([]);

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

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="text-2xl tracking-tight">Flash card mode</h1>
      <FlashCard word={getLearnedQuery.data[2]!} />
      {/* <List words={wordsToDisplay} actions={actions}></List> */}
    </div>
  );
}
