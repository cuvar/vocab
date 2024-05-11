import { useAtom } from "jotai";
import { useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../lib/ui/hooks";
import { type TagData } from "../server/domain/client/tagData";
import {
  refetchWordsAtom,
  showEditorModalAtom,
  wordToEditAtom,
} from "../server/store";
import RelatedWordList from "./RelatedWordList";
import TagSelect from "./TagSelect";

type Props = {
  collectionId: string;
};

export default function Editor(props: Props) {
  const [englishInput, setEnglishInput] = useState("");
  const [germanInput, setGermanInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [TagData, setTagData] = useState<TagData[]>([]);
  const [showExistingWords, setShowExistingWords] = useState(false);
  const [, setWordToEdit] = useAtom(wordToEditAtom);
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [, setRefetchWords] = useAtom(refetchWordsAtom);

  const showToast = useToast();

  api.tag.getAll.useQuery(
    {
      collectionId: props.collectionId,
    },
    {
      onSuccess: (data) => {
        const _TagData = data.map((d) => {
          return {
            id: d.id,
            name: d.name,
            description: d.description,
            checked: false,
          } as TagData;
        });
        setTagData(_TagData);
      },
    }
  );

  const addWordMutation = api.word.addWord.useMutation({
    onSuccess: (word) => {
      showToast(`"${word}" added`, "success");
      setRefetchWords(true);
    },
    onError: (err) => showToast(`${err.message}`, "error"),
  });

  function addWord() {
    const tags: string[] = TagData.filter((t) => t.checked).map((t) => t.id);
    addWordMutation.mutate({
      front: englishInput,
      back: germanInput,
      notes: notesInput,
      collectionId: props.collectionId,
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

  function onTagsSelectChange(_TagData: TagData[]) {
    setTagData(_TagData);
  }

  return (
    <form method="dialog" className="modal-box max-w-xs">
      <button
        className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
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
          {TagData.length > 0 && (
            <TagSelect tags={TagData} handler={onTagsSelectChange} />
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
          className="btn-success btn max-w-xs"
          onClick={addWord}
          disabled={disableButton()}
        >
          Add
        </button>
      </div>
    </form>
  );
}
