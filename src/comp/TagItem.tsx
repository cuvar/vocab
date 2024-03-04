import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "../server/api/api";
import {
  deleteTagConfirmedAtom,
  showMessageModalAtom,
  tagToDeleteAtom,
  toastTextAtom,
  toastTypeAtom,
} from "../server/store";
import { checkedIcon, crossIcon, penIcon } from "../utils/icons";

type Props = {
  id?: string;
  name: string;
  description: string;
  doneHandler: () => void;
};

export default function TagItem(props: Props) {
  const [nameInput, setNameInput] = useState(props.name);
  const [descInput, setDescInput] = useState(props.description);
  const [editMode, setEditMode] = useState(props.id ? false : true);
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);
  const [, setShowMessageModal] = useAtom(showMessageModalAtom);
  const [tagToDelete, setTagToDelete] = useAtom(tagToDeleteAtom);
  const [deleteTagConfirmed, setDeleteTagConfirmed] = useAtom(
    deleteTagConfirmedAtom,
  );

  const updateTagMutation = api.tag.updateTag.useMutation({
    onSuccess: (tag) => {
      setToastType("success");
      setToastText(`"${tag.name}" changed`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
      props.doneHandler();
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  const addTagMutation = api.tag.addTag.useMutation({
    onSuccess: (tag) => {
      setToastType("success");
      setToastText(`"${tag.name}" added`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
      props.doneHandler();
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  const deleteTagMutation = api.tag.deleteTag.useMutation({
    onSuccess: (tag) => {
      setToastType("success");
      setToastText(`"${tag.name}" successfully deleted`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
      props.doneHandler();
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
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
    <div className="border-base-500 flex w-full flex-col justify-between space-x-0 space-y-4 border-b px-2 py-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div className="flex space-x-4">
        <div className="form-control w-1/4 max-w-xs">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full max-w-xs"
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
            className="textarea textarea-bordered w-full max-w-xs"
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
            className="btn btn-secondary align-bottom"
            onClick={handleSave}
          >
            {checkedIcon}
          </button>
        ) : (
          <button
            className="btn btn-secondary align-bottom"
            onClick={handleEdit}
          >
            {penIcon}
          </button>
        )}
        <button className="btn btn-error align-bottom" onClick={handleAbort}>
          {crossIcon}
        </button>
      </div>
    </div>
  );
}
