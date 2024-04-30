import { useRouter } from "next/router";
import { useState } from "react";
import CollectionItem from "~/comp/CollectionItem";
import { useToast } from "~/lib/ui/hooks";
import { eyeIcon, penIcon } from "~/lib/ui/icons";
import { type FECollection } from "~/server/domain/client/feCollection";
import { api } from "../lib/api";
import Error from "./Error";
import Loading from "./Loading";

export default function Collections() {
  const [collections, setCollections] = useState<FECollection[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");

  const showToast = useToast();
  const router = useRouter();

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

  function handleNavigate(path: string) {
    if (editMode) return;
    void router.push(path);
  }

  function handleEdit() {
    setEditMode(!editMode);
  }

  function handleRefetch() {
    void getCollectionsQuery.refetch();
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">Collections</h1>
      <div className="flex w-full justify-end">
        <button className="btn-ghost btn" onClick={handleEdit}>
          {editMode ? eyeIcon : penIcon}
        </button>
      </div>
      {editMode ? (
        <div className="flex w-full flex-col">
          {collections.map((collection) => {
            return (
              <CollectionItem
                key={collection.id}
                id={collection.id}
                name={collection.name}
                description={collection.description}
                doneHandler={handleRefetch}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
          {collections.map((collection) => {
            return (
              <div
                key={collection.id}
                className="relative flex cursor-pointer flex-col rounded-lg border border-gray-400 p-6 shadow-md transition duration-300 ease-in-out hover:bg-slate-700"
                onClick={() => handleNavigate(`/c/${collection.id}/cards`)}
              >
                <h2 className="text-xl font-bold">{collection.name}</h2>
                <p>{collection.description}</p>
              </div>
            );
          })}
        </div>
      )}
      {editMode && (
        <CollectionItem
          id={""}
          name={""}
          description={""}
          doneHandler={handleRefetch}
        />
      )}
    </div>
  );
}
