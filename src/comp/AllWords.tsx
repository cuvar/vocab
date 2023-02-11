import { api } from "../utils/api";
import List from "./List";

export default function AllWords() {
  const allQuery = api.word.getAll.useQuery();
  const markAsLearnedQuery = api.word.markAsLearned.useMutation();

  if (allQuery.isLoading) {
    return <div>loading</div>;
  }

  if (!allQuery.data) {
    return <div>no data</div>;
  }

  function markAsLearned(word: string, mark: boolean) {
    markAsLearnedQuery.mutate({
      word: word,
      learned: mark,
    });
    allQuery.refetch();
  }

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">
        All words: {allQuery.data.length}
      </h1>
      <List
        words={allQuery.data}
        markHandler={(w: string, m: boolean) => markAsLearned(w, m)}
      ></List>
    </div>
  );
}
