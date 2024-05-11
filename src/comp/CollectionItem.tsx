import { useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../lib/ui/hooks";
import { checkedIcon, trashIcon } from "../lib/ui/icons";

type Props = {
  id?: string;
  name: string;
  description: string;
  doneHandler: () => void;
};

export default function TagItem(props: Props) {
  const [nameInput, setNameInput] = useState(props.name);
  const [descInput, setDescInput] = useState(props.description);

  const showToast = useToast();

  const addCollectionMutation = api.collection.add.useMutation({
    onSuccess: (_data) => {
      props.doneHandler();
      setNameInput("");
      setDescInput("");
      showToast("Collection added", "success");
    },
  });

  const updateCollectionMutation = api.collection.update.useMutation({
    onSuccess: (_data) => {
      props.doneHandler();
      showToast(`Collection "${_data.name}" updated`, "success");
    },
  });

  const deleteCollectionMutation = api.collection.delete.useMutation({
    onSuccess: (_data) => {
      props.doneHandler();
      showToast("Collection deleted", "success");
    },
  });

  function handleAdd() {
    addCollectionMutation.mutate({
      name: nameInput,
      description: descInput,
    });
  }

  function handleUpdate(collectionId: string) {
    updateCollectionMutation.mutate({
      collectionId: collectionId,
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

  function handleSave() {
    if (props.id) {
      handleUpdate(props.id);
    } else {
      handleAdd();
    }
  }

  return (
    <div className="border-base-500 flex w-full flex-col justify-between space-y-4 space-x-0 border-b px-2 py-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="flex w-full flex-col space-y-2 space-x-0 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="form-control w-1/4 max-w-xs">
          <input
            type="text"
            placeholder="Name"
            className="input-bordered input w-full max-w-xs"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>
        <div className="form-control w-3/4 max-w-xs">
          <textarea
            placeholder="Description"
            className="textarea-bordered textarea w-full max-w-xs"
            value={descInput}
            rows={1}
            onChange={(e) => setDescInput(e.target.value)}
          />
        </div>
      </div>
      <div className="sm:justif(y-end flex items-end justify-end space-x-4">
        <button className="btn-secondary btn align-bottom" onClick={handleSave}>
          {checkedIcon}
        </button>
        {props.id && (
          <button
            className="btn-error btn align-bottom"
            onClick={() => handleDelete(props.id!)}
          >
            {trashIcon}
          </button>
        )}
      </div>
    </div>
  );
}
