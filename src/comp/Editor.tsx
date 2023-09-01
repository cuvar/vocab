import AddWordEditor from "./AddWordEditor";
import EditWordEditor from "./EditWordEditor";
import Modal from "./Modal";

type Props = {
  word: VocabularyWord | null;
};

export default function Editor(props: Props) {
  return (
    <Modal>
      {props.word ? <EditWordEditor word={props.word} /> : <AddWordEditor />}
    </Modal>
  );
}
