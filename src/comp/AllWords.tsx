import { api } from "../utils/api";
import List from "./List";

export default function AllWords() {
  const { data, isLoading } = api.word.getAll.useQuery();

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <div className="container flex w-full flex-col items-center justify-center gap-12 px-4">
      <h1 className="text-2xl tracking-tight">All words: {data.length}</h1>
      <List words={data}></List>
    </div>
  );
}
