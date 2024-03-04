import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useState, type ChangeEvent } from "react";
import { api } from "../server/api/api";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import { isLearnMode } from "../server/utils/guards/words";
import { type TagData, type VocabularyWord } from "../types/types";
import TagSelect from "./TagSelect";

type Props = {
  word: VocabularyWord;
};

export default function Editor(props: Props) {
  const [translationInput, setTranslationInput] = useState(
    props.word.translation,
  );
  const [nativeInput, setNativeInput] = useState(props.word.native);
  const [notesInput, setNotesInput] = useState(props.word.notes);
  const [modeInput, setModeInput] = useState(props.word.mode);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [tagData, setTagData] = useState<TagData[]>([]);
  const [, setToastText] = useAtom(toastTextAtom);
  const [, setToastType] = useAtom(toastTypeAtom);
  const [, setRefetchWords] = useAtom(refetchWordsAtom);

  api.tag.getAllForWord.useQuery(
    { wordId: props.word.id },
    { onSuccess: (data) => setTagData(data) },
  );

  const updateWordMutation = api.word.updateWord.useMutation({
    onSuccess: (word) => {
      setToastType("success");
      setToastText(`"${word}" changed`);
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

  function editWord() {
    const tags: string[] = tagData.filter((t) => t.checked).map((t) => t.id);

    updateWordMutation.mutate({
      id: props.word.id,
      translation: translationInput,
      native: nativeInput,
      notes: notesInput,
      mode: modeInput,
      tagIds: tags,
    });
    clearEditor();
  }

  function disableButton() {
    return translationInput.trim() == "" || nativeInput.trim() == "";
  }

  function clearEditor() {
    setWordToEdit(null);
    setTagData([]);
    setShowEditorModal(false);
  }

  function onTagsSelectChange(_tagData: TagData[]) {
    setTagData(_tagData);
  }

  function transformMode(mode: LearnMode) {
    const firstLetter = mode.slice(0, 1);
    const lastLetters = mode.slice(1);
    return firstLetter + lastLetters.toLocaleLowerCase();
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (!isLearnMode(value)) {
      return;
    }
    setModeInput(value);
  }

  return (
    <form method="dialog" className="modal-box max-w-xs">
      <button
        className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
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
            className="input input-bordered w-full max-w-xs"
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
            className="textarea textarea-bordered w-full max-w-xs"
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
            className="input input-bordered w-full max-w-xs"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Mode</span>
          </label>

          <select
            className="select select-bordered w-full max-w-xs"
            onChange={handleSelectChange}
          >
            <option
              value={LearnMode.LEARNED}
              selected={modeInput === LearnMode.LEARNED}
            >
              {transformMode(LearnMode.LEARNED)}
            </option>
            <option
              value={LearnMode.UNLEARNED}
              selected={modeInput === LearnMode.UNLEARNED}
            >
              {transformMode(LearnMode.UNLEARNED)}
            </option>
            <option
              value={LearnMode.ARCHIVED}
              selected={modeInput === LearnMode.ARCHIVED}
            >
              {transformMode(LearnMode.ARCHIVED)}
            </option>
          </select>
        </div>
        <div className="form-control">
          {tagData.length > 0 && (
            <TagSelect tags={tagData} handler={onTagsSelectChange} />
          )}
        </div>
        <button
          className="btn btn-success max-w-xs"
          onClick={editWord}
          disabled={disableButton()}
        >
          Save
        </button>
      </div>
    </form>
  );
}
