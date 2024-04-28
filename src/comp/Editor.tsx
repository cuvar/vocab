import { useAtom } from "jotai";
import { type VocabularyWord } from "../server/domain/client/vocabularyWord";
import { editorModalIdAtom } from "../server/store";
import AddWordEditor from "./AddWordEditor";
import EditWordEditor from "./EditWordEditor";
import Modal from "./Modal";

type Props = {
  word: VocabularyWord | null;
};

export default function Editor(props: Props) {
  const [editorModalId] = useAtom(editorModalIdAtom);
  return (
    <Modal id={editorModalId}>
      {props.word ? <EditWordEditor word={props.word} /> : <AddWordEditor />}
    </Modal>
  );
}
