import { useAtom } from "jotai";
import { modalIdAtom, showModalAtom } from "../server/store";

type Props = {
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const [modalId] = useAtom(modalIdAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);

  window.addEventListener("keydown", (evt) => {
    if (showModal && evt.key === "Escape") {
      setShowModal(false);
    }
  });

  return (
    <dialog id={modalId} className="modal">
      {props.children}
    </dialog>
  );
}
