import { useState } from "react";
import { api } from "../utils/api";
import { useAtom } from "jotai";
import { addModalIdAtom, toastTextAtom, toastTypeAtom } from "../server/store";
import RelatedWordList from "./RelatedWordList";

export default function Editor() {
  const [englishInput, setEnglishInput] = useState("");
  const [germanInput, setGermanInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [businessInput, setBusinessInput] = useState(false);

  const [_, setToastText] = useAtom(toastTextAtom);
  const [__, setToastType] = useAtom(toastTypeAtom);
  const [addModal, ___] = useAtom(addModalIdAtom);

  const addWordMutation = api.word.addWord.useMutation({
    onSuccess: (data) => {
      setToastType("success");
      setToastText(`"${data.english}" added`);
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

  function addWord() {
    addWordMutation.mutate({
      english: englishInput,
      german: germanInput,
      notes: notesInput,
      business: businessInput,
    });
  }

  function disableButton() {
    return englishInput.trim() == "" || germanInput.trim() == "";
  }

  return (
    <dialog id={addModal} className="modal">
      <form method="dialog" className="modal-box max-w-xs">
        <button className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2">
          ✕
        </button>
        <h3 className="mb-4 text-lg font-bold">Add a Word</h3>
        <div className="flex flex-col space-y-4">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">English</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input w-full max-w-xs"
              value={englishInput}
              onChange={(e) => setEnglishInput(e.target.value)}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">German</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input w-full max-w-xs"
              value={germanInput}
              onChange={(e) => setGermanInput(e.target.value)}
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
              <span className="label-text">Business word</span>
              <input
                type="checkbox"
                checked={businessInput}
                className="checkbox"
                onChange={(e) => setBusinessInput(!businessInput)}
              />
            </label>
          </div>
          <div className="collapse bg-base-200">
            <input type="checkbox" checked={true} />
            <div className="collapse-title text-xl font-medium">
              Existing words
            </div>
            <div className="collapse-content">
              <RelatedWordList word={englishInput} />
            </div>
          </div>
          <button
            className="btn-success btn max-w-xs"
            onClick={addWord}
            disabled={disableButton()}
          >
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
