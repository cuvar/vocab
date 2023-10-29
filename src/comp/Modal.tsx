import { useAtom } from "jotai";
import { modalIdAtom, showEditorModalAtom } from "../server/store";

type Props = {
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const [modalId] = useAtom(modalIdAtom);
  const [showEditorModal, setShowEditorModal] = useAtom(showEditorModalAtom);

  window.addEventListener("keydown", (evt) => {
    if (showEditorModal && evt.key === "Escape") {
      setShowEditorModal(false);
    }
  });

  return (
    <dialog id={modalId} className="modal">
      {props.children}
    </dialog>
  );
}
