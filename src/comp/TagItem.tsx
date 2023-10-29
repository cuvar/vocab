import { useAtom } from "jotai";
import { useState } from "react";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { type Tag } from "../types/types";
import { api } from "../utils/api";
import { checkedIcon, penIcon } from "../utils/icons";

type Props = {
  tag: Tag;
  refetchHandler: () => void;
};

export default function TagItem(props: Props) {
  const [nameInput, setNameInput] = useState(props.tag.name);
  const [descInput, setDescInput] = useState(props.tag.description);
  const [editMode, setEditMode] = useState(false);
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  const updateTagMutation = api.tag.updateTag.useMutation({
    onSuccess: (tag) => {
      setToastType("success");
      setToastText(`"${tag.name}" changed`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
      props.refetchHandler();
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
    updateTagMutation.mutate({
      id: props.tag.id,
      name: nameInput,
      description: descInput,
    });
  }

  return (
    <div className="border-base-500 flex w-full space-x-4 border-b px-2 py-4">
      <div className="form-control w-1/3 max-w-xs">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input w-full max-w-xs"
          disabled={!editMode}
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
      </div>
      <div className="form-control w-2/3 max-w-xs">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          placeholder="Type here"
          className="textarea-bordered textarea w-full max-w-xs"
          disabled={!editMode}
          value={descInput}
          rows={1}
          onChange={(e) => setDescInput(e.target.value)}
        />
      </div>
      <div className="flex flex-col justify-end">
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
      </div>
    </div>
  );
}
