import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../lib/ui/hooks";
import { checkedIcon, crossIcon, penIcon } from "../lib/ui/icons";
import {
  deleteTagConfirmedAtom,
  showMessageModalAtom,
  tagToDeleteAtom,
} from "../server/store";

type Props = {
  id?: string;
  name: string;
  description: string;
  doneHandler: () => void;
  collectionId: string;
};

export default function TagItem(props: Props) {
  const [nameInput, setNameInput] = useState(props.name);
  const [descInput, setDescInput] = useState(props.description);
  const [editMode, setEditMode] = useState(props.id ? false : true);
  const [, setShowMessageModal] = useAtom(showMessageModalAtom);
  const [tagToDelete, setTagToDelete] = useAtom(tagToDeleteAtom);
  const [deleteTagConfirmed, setDeleteTagConfirmed] = useAtom(
    deleteTagConfirmedAtom
  );

  const showToast = useToast();

  const updateTagMutation = api.tag.updateTag.useMutation({
    onSuccess: (tag) => {
      showToast(`"${tag.name}" changed`, "success");
      props.doneHandler();
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const addTagMutation = api.tag.addTag.useMutation({
    onSuccess: (tag) => {
      showToast(`"${tag.name}" added`, "success");
      props.doneHandler();
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const deleteTagMutation = api.tag.deleteTag.useMutation({
    onSuccess: (tag) => {
      showToast(`"${tag.name}" successfully deleted`, "success");
      props.doneHandler();
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  function handleEdit() {
    setEditMode(true);
  }

  function handleSave() {
    setEditMode(false);
    if (props.id) {
      updateTagMutation.mutate({
        id: props.id,
        name: nameInput,
        description: descInput,
      });
    } else {
      addTagMutation.mutate({
        name: nameInput,
        description: descInput,
        collectionId: props.collectionId,
      });
    }
  }

  function handleAbort() {
    if (!props.id) {
      props.doneHandler();
      return;
    } else {
      setTagToDelete(props.name);
      setShowMessageModal(true);
    }
  }

  function deleteTag() {
    if (props.id && props.name === tagToDelete) {
      deleteTagMutation.mutate({ id: props.id });
      setTagToDelete(null);
    }
  }

  useEffect(() => {
    if (deleteTagConfirmed) {
      setDeleteTagConfirmed(false);
      deleteTag();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteTagConfirmed, setDeleteTagConfirmed]);

  return (
    <div className="border-base-500 flex w-full flex-col justify-between space-y-4 space-x-0 border-b px-2 py-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="flex space-x-4">
        <div className="form-control w-1/4 max-w-xs">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input-bordered input w-full max-w-xs"
            disabled={!editMode}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        </div>
        <div className="form-control w-3/4 max-w-xs">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            placeholder="Description"
            className="textarea-bordered textarea w-full max-w-xs"
            disabled={!editMode}
            value={descInput}
            rows={1}
            onChange={(e) => setDescInput(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-end justify-end space-x-4 sm:justify-end">
        {editMode ? (
          <button
            className="btn-secondary btn align-bottom"
            onClick={handleSave}
          >
            {checkedIcon}
          </button>
        ) : (
          <button
            className="btn-secondary btn align-bottom"
            onClick={handleEdit}
          >
            {penIcon}
          </button>
        )}
        <button className="btn-error btn align-bottom" onClick={handleAbort}>
          {crossIcon}
        </button>
      </div>
    </div>
  );
}
