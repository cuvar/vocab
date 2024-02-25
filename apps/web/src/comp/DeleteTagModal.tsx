import { useAtom } from "jotai";
import {
  deleteTagConfirmedAtom,
  showMessageModalAtom,
  tagToDeleteAtom,
} from "../../../server/src/store";

type Props = {
  tag: string;
};

export default function DeleteTagModal(props: Props) {
  const [, setTagToDelete] = useAtom(tagToDeleteAtom);
  const [, setDeleteTagConfirmed] = useAtom(deleteTagConfirmedAtom);
  const [, setShowMessageModal] = useAtom(showMessageModalAtom);

  function clearModal() {
    setShowMessageModal(false);
    setTagToDelete(null);
  }
  function onConfirm() {
    setShowMessageModal(false);
    setDeleteTagConfirmed(true);
  }

  return (
    <form method="dialog" className="modal-box max-w-xs">
      <button
        className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2"
        onClick={clearModal}
      >
        ✕
      </button>
      <h3 className="mb-4 text-lg font-bold">Add a Word</h3>
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <p className="text-center">Do you really want to delete the tag?</p>
          <p className="text-center text-xl">Tag: {props.tag} </p>
        </div>
        <div className="flex justify-between">
          <button className="btn-error btn" onClick={clearModal}>
            No
          </button>
          <button className="btn-success btn" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </form>
  );
}
