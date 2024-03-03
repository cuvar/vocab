import { type VocabularyWord } from "@vocab/validators/src/types";
import { useAtom } from "jotai";
import { editorModalIdAtom } from "../utils/store";
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
