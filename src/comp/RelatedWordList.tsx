import { api } from "../lib/api";

type Props = {
  word: string;
};

export default function RelatedWordList(props: Props) {
  const searchWordQuery = api.word.searchWord.useQuery({ word: props.word });

  return (
    <div className="flex h-36 flex-col justify-start">
      {!searchWordQuery.data || props.word.trim() == "" ? (
        <div className="w-full text-center">no related words</div>
      ) : (
        searchWordQuery.data.map((word) => (
          <div
            key={word.front}
            className="rounded-md border-t-2 border-b-2 border-black bg-white px-2 py-2 text-black"
          >
            <p>{word.front}</p>
          </div>
        ))
      )}
    </div>
  );
}
