import { useRouter } from "next/router";
import { useState } from "react";
import { useToast } from "~/lib/ui/hooks";
import { checkedIcon, crossIcon, eyeIcon, penIcon } from "~/lib/ui/icons";
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
  const addCollectionMutation = api.collection.add.useMutation({
    onSuccess: (_data) => {
      void getCollectionsQuery.refetch();
      setNameInput("");
      setDescInput("");
      showToast("Collection added", "success");
    },
  });

  const deleteCollectionMutation = api.collection.delete.useMutation({
    onSuccess: (_data) => {
      void getCollectionsQuery.refetch();
      showToast("Collection deleted", "success");
    },
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

  function handleAdd() {
    addCollectionMutation.mutate({
      name: nameInput,
      description: descInput,
    });
  }

  function handleDelete(collectionId: string) {
    const confirm = window.confirm(
      "Are you sure you want to delete this collection and all words/data related to it?"
    );
    if (confirm) {
      deleteCollectionMutation.mutate({
        collectionId: collectionId,
      });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start gap-12 px-4">
      <h1 className="mt-5 mb-2 text-2xl tracking-tight">Collections</h1>
      <div className="flex w-full justify-end">
        <button className="btn-ghost btn" onClick={handleEdit}>
          {editMode ? eyeIcon : penIcon}
        </button>
      </div>
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
              {editMode && (
                <button
                  onClick={() => handleDelete(collection.id)}
                  className="absolute top-2 right-2 w-fit rounded-full bg-red-500 p-1 hover:bg-red-700"
                >
                  {crossIcon}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {editMode && (
        <div className="flex w-full flex-col justify-between space-y-4 space-x-0 px-2 py-4">
          <div className="flex w-full space-x-4">
            <div className="form-control w-1/4">
              <input
                type="text"
                placeholder="Name"
                className="input-bordered input w-full"
                disabled={!editMode}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
            <div className="form-control w-3/4">
              <textarea
                placeholder="Description"
                className="textarea-bordered textarea w-full"
                disabled={!editMode}
                value={descInput}
                rows={1}
                onChange={(e) => setDescInput(e.target.value)}
              />
            </div>
          </div>
          <button className="btn-secondary btn" onClick={handleAdd}>
            {checkedIcon}
          </button>
        </div>
      )}
    </div>
  );
}
