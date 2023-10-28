import { useAtom } from "jotai";
import { modalIdAtom } from "../server/store";

type Props = {
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const [modalId] = useAtom(modalIdAtom);

  return (
    <dialog id={modalId} className="modal">
      {props.children}
    </dialog>
  );
}
