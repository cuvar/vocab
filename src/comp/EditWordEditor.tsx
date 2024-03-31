import { LearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useState, type ChangeEvent } from "react";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  wordToEditAtom,
} from "../server/store";
import { type TagData, type VocabularyWord } from "../types/types";
import { api } from "../utils/api";
import { isLearnMode } from "../utils/guards/words";
import { useToast } from "../utils/hooks";
import TagSelect from "./TagSelect";

type Props = {
  word: VocabularyWord;
};

export default function Editor(props: Props) {
  const [translationInput, setTranslationInput] = useState(
    props.word.translation
  );
  const [nativeInput, setNativeInput] = useState(props.word.native);
  const [notesInput, setNotesInput] = useState(props.word.notes);
  const [modeInput, setModeInput] = useState(props.word.mode);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [tagData, setTagData] = useState<TagData[]>([]);
  const [, setRefetchWords] = useAtom(refetchWordsAtom);

  const showToast = useToast();

  api.tag.getAllForWord.useQuery(
    { wordId: props.word.id },
    { onSuccess: (data) => setTagData(data) }
  );

  const updateWordMutation = api.word.updateWord.useMutation({
    onSuccess: (word) => {
      showToast(`"${word}" changed`, "success");
      setRefetchWords(true);
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const deleteWordMutation = api.word.deleteWord.useMutation({
    onSuccess: (data) =>
      showToast(`"${data.translation}" was deleted successfully`, "success"),
    onError: (err) => showToast(`${err.message}`, "error"),
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

  function deleteWord() {
    const confirmed = confirm("Are you sure you want to delete this word?");
    if (confirmed) {
      deleteWordMutation.mutate({ id: props.word.id });
    }
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
          <label className="label">
            <span className="label-text">Mode</span>
          </label>

          <select
            className="select-bordered select w-full max-w-xs"
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
          className="btn-success btn max-w-xs"
          onClick={editWord}
          disabled={disableButton()}
        >
          Save
        </button>
        <button className="btn-error btn max-w-xs" onClick={deleteWord}>
          Delete
        </button>
      </div>
    </form>
  );
}
