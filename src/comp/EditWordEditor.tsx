import { useAtom } from "jotai";
import { useState } from "react";
import {
  showModalAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import { type VocabularyWord } from "../types/types";
import { api } from "../utils/api";

type Props = {
  word: VocabularyWord;
};

export default function Editor(props: Props) {
  const [translationInput, setTranslationInput] = useState(
    props.word.translation
  );
  const [nativeInput, setNativeInput] = useState(props.word.native);
  const [notesInput, setNotesInput] = useState(props.word.notes);
  const [learnedInput, setLearnedInput] = useState(props.word.learned);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);

  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);

  const updateWordMutation = api.word.updateWord.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.translation}" changed`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
    onError: (err) => {
      setToastType("error");
      setToastText(`${err.message}`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
    },
  });

  function editWord() {
    updateWordMutation.mutate({
      id: props.word.id,
      translation: translationInput,
      native: nativeInput,
      notes: notesInput,
      learned: learnedInput,
    });
  }

  function disableButton() {
    return translationInput.trim() == "" || nativeInput.trim() == "";
  }

  function clearEditor() {
    // setShowModal(false)
    console.log(showModal);
    setWordToEdit(null);
    setShowModal(false);
  }
  return (
    <form method="dialog" className="modal-box max-w-xs">
      <button
        className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
        onClick={clearEditor}
      >
        ✕
      </button>
      <h3 className="mb-4 text-lg font-bold">
        Edit &quot;{props.word.translation}&quot;
      </h3>
      <div className="flex flex-col space-y-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">English</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full max-w-xs"
            value={translationInput}
            onChange={(e) => setTranslationInput(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">German</span>
          </label>
          <textarea
            placeholder="Type here"
            className="textarea-bordered textarea w-full max-w-xs"
            value={nativeInput}
            onChange={(e) => setNativeInput(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Notes</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full max-w-xs"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Learned</span>
            <input
              type="checkbox"
              checked={learnedInput}
              className="checkbox"
              onChange={(e) => setLearnedInput(!learnedInput)}
            />
          </label>
        </div>
        <button
          className="btn-success btn max-w-xs"
          onClick={editWord}
          disabled={disableButton()}
        >
          Save
        </button>
      </div>
    </form>
  );
}
