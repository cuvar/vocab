import { LearnMode as PrismaLearnMode } from "@prisma/client";
import { useAtom } from "jotai";
import { useState, type ChangeEvent } from "react";
import { type FECollection } from "~/server/domain/client/feCollection";
import { api } from "../lib/api";
import { useToast } from "../lib/ui/hooks";
import { type TagData } from "../server/domain/client/tagData";
import { type VocabularyWord } from "../server/domain/client/vocabularyWord";
import { LearnMode } from "../server/domain/server/learnMode";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  wordToEditAtom,
} from "../server/store";
import CollectionSelect from "./CollectionSelect";
import TagSelect from "./TagSelect";

type Props = {
  word: VocabularyWord;
  collectionId: string;
};

export default function Editor(props: Props) {
  const [translationInput, setTranslationInput] = useState(props.word.front);
  const [nativeInput, setNativeInput] = useState(props.word.back);
  const [notesInput, setNotesInput] = useState(props.word.notes);
  const [modeInput, setModeInput] = useState(props.word.mode);
  const [collectionIdInput, setCollectionIdInput] = useState(
    props.word.collectionId
  );
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [TagData, setTagData] = useState<TagData[]>([]);
  const [collectionData, setCollectionData] = useState<FECollection[]>([]);
  const [, setRefetchWords] = useAtom(refetchWordsAtom);

  const showToast = useToast();

  api.tag.getAllForWord.useQuery(
    { wordId: props.word.id, collectionId: props.collectionId },
    { onSuccess: (data) => setTagData(data) }
  );

  api.collection.getAll.useQuery(undefined, {
    onSuccess: (data) => setCollectionData(data),
  });

  const updateWordMutation = api.word.updateWord.useMutation({
    onSuccess: (word) => {
      showToast(`"${word}" changed`, "success");
      setRefetchWords(true);
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  const deleteWordMutation = api.word.deleteWord.useMutation({
    onSuccess: (data) =>
      showToast(`"${data.front}" was deleted successfully`, "success"),
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  function editWord() {
    const tags: string[] = TagData.filter((t) => t.checked).map((t) => t.id);

    updateWordMutation.mutate({
      id: props.word.id,
      front: translationInput,
      back: nativeInput,
      notes: notesInput,
      collectionId: collectionIdInput,
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

  function onTagsSelectChange(_TagData: TagData[]) {
    setTagData(_TagData);
  }

  function onCollectionSelectChange(_collectionData: FECollection) {
    setCollectionIdInput(_collectionData.id);
  }

  function transformMode(mode: PrismaLearnMode) {
    const firstLetter = mode.slice(0, 1);
    const lastLetters = mode.slice(1);
    return firstLetter + lastLetters.toLocaleLowerCase();
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (!LearnMode.validate(value)) {
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
        Edit &quot;{props.word.front}&quot;
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
              value={PrismaLearnMode.LEARNED}
              selected={modeInput === PrismaLearnMode.LEARNED}
            >
              {transformMode(PrismaLearnMode.LEARNED)}
            </option>
            <option
              value={PrismaLearnMode.UNLEARNED}
              selected={modeInput === PrismaLearnMode.UNLEARNED}
            >
              {transformMode(PrismaLearnMode.UNLEARNED)}
            </option>
            <option
              value={PrismaLearnMode.ARCHIVED}
              selected={modeInput === PrismaLearnMode.ARCHIVED}
            >
              {transformMode(PrismaLearnMode.ARCHIVED)}
            </option>
          </select>
        </div>
        <div className="form-control">
          {TagData.length > 0 && (
            <TagSelect tags={TagData} handler={onTagsSelectChange} />
          )}
        </div>
        <div className="form-control">
          {collectionData.length > 0 && (
            <CollectionSelect
              preselected={collectionData.find(
                (c) => c.id === collectionIdInput
              )}
              collections={collectionData}
              handler={onCollectionSelectChange}
            />
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
