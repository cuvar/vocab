import { useAtom } from "jotai";
import { showEditorModalAtom } from "../../../server/src/store";

type Props = {
  children: React.ReactNode;
  id: string;
};

export default function Modal(props: Props) {
  const [showEditorModal, setShowEditorModal] = useAtom(showEditorModalAtom);

  window.addEventListener("keydown", (evt) => {
    if (showEditorModal && evt.key === "Escape") {
      setShowEditorModal(false);
    }
  });

  return (
    <dialog id={props.id} className="modal">
      {props.children}
    </dialog>
  );
}
