import { useState } from "react";
import { useAtom } from "jotai";

import type { TagData } from "@vocab/validators/src/types";

import {
  refetchWordsAtom,
  showEditorModalAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../utils/store";
import RelatedWordList from "./RelatedWordList";
import TagSelect from "./TagSelect";
import { api } from "@vocab/api";

export default function Editor() {
  const [englishInput, setEnglishInput] = useState("");
  const [germanInput, setGermanInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [tagData, setTagData] = useState<TagData[]>([]);
  const [showExistingWords, setShowExistingWords] = useState(false);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);
  const [, setRefetchWords] = useAtom(refetchWordsAtom);

  api.tag.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      const _tagData = data.map((d) => {
        return {
          ...d,
          checked: false,
        } satisfies TagData;
      });
      setTagData(_tagData);
    },
  });

  const addWordMutation = api.word.addWord.useMutation({
    onSuccess: (word) => {
      setToastType("success");
      setToastText(`"${word}" added`);
      setTimeout(() => {
        setToastText("");
      }, 1500);
      setRefetchWords(true);
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
    const tags: string[] = tagData.filter((t) => t.checked).map((t) => t.id);
    addWordMutation.mutate({
      translation: englishInput,
      native: germanInput,
      notes: notesInput,
      tagIds: tags,
    });
    clearEditor();
  }

  function disableButton() {
    return englishInput.trim() == "" || germanInput.trim() == "";
  }

  function clearEditor() {
    setEnglishInput("");
    setGermanInput("");
    setNotesInput("");
    setShowExistingWords(false);
    setWordToEdit(null);
    setTagData([]);
    setShowEditorModal(false);
  }

  function onTagsSelectChange(_tagData: TagData[]) {
    setTagData(_tagData);
  }

  return (
    <form method="dialog" className="modal-box max-w-xs">
      <button
        className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
        onClick={clearEditor}
      >
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
            className="input input-bordered w-full max-w-xs"
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
            className="input input-bordered w-full max-w-xs"
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
            className="input input-bordered w-full max-w-xs"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
          />
        </div>
        <div className="form-control">
          {tagData.length > 0 && (
            <TagSelect tags={tagData} handler={onTagsSelectChange} />
          )}
        </div>
        <div className="collapse bg-base-200">
          <input
            type="checkbox"
            checked={showExistingWords}
            onChange={() => setShowExistingWords(!showExistingWords)}
          />
          <div className="collapse-title text-lg font-medium">
            Existing words
          </div>
          <div className="collapse-content">
            <RelatedWordList word={englishInput} />
          </div>
        </div>
        <button
          className="btn btn-success max-w-xs"
          onClick={addWord}
          disabled={disableButton()}
        >
          Add
        </button>
      </div>
    </form>
  );
}
