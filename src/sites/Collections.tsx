import { useState } from "react";
import { type FECollection } from "~/server/domain/client/feCollection";
import { api } from "../lib/api";
import Error from "./Error";
import Loading from "./Loading";

export default function Collections() {
  const [collections, setCollections] = useState<FECollection[]>([]);

  const getCollectionsQuery = api.collection.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      setCollections(data);
    },
    refetchOnWindowFocus: false,
  });

  if (getCollectionsQuery.isLoading) {
    return <Loading />;
  }

  if (!getCollectionsQuery) {
    return <Error msg={"No data available"} />;
  }

  function handleDelete() {
    console.log("Delete");
  }

  function handleViewWords() {
    console.log("View Words");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
        {collections.map((collection) => {
          return (
            <a
              key={collection.id}
              className="flex flex-col rounded-lg border border-gray-400 p-6 shadow-md transition duration-300 ease-in-out hover:bg-slate-700"
              href={`/c/${collection.id}`}
            >
              <h2 className="text-xl font-bold">{collection.name}</h2>
              <p>{collection.description}</p>
              <div className="flex gap-2">
                <button onClick={handleDelete}>Delete</button>
                <button onClick={handleViewWords}>View Words</button>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
