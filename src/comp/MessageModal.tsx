import { useAtom } from "jotai";
import { messageModalIdAtom, showMessageModalAtom } from "../server/store";
import DeleteTagModal from "./DeleteTagModal";
import Modal from "./Modal";

type Props = {
  tag: string | null;
};

export default function MessageModal(props: Props) {
  const [messageModalId] = useAtom(messageModalIdAtom);
  const [, setShowMessageModal] = useAtom(showMessageModalAtom);

  function clearModal() {
    setShowMessageModal(false);
  }

  return (
    <Modal id={messageModalId}>
      {props.tag ? (
        <DeleteTagModal tag={props.tag} />
      ) : (
        <form method="dialog" className="modal-box max-w-xs">
          <button
            className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
            onClick={clearModal}
          >
            ✕
          </button>
          <h3 className="mb-4 text-lg font-bold">Nothing here</h3>
        </form>
      )}
    </Modal>
  );
}
