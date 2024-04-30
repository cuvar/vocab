import { useAtom } from "jotai";
import { hamburgerIcon, plusIcon } from "../lib/ui/icons";
import { showEditorModalAtom } from "../server/store";
import Menu from "./Menu";

type Props = {
  collectionId?: string;
};

export default function Navbar(props: Props) {
  const [, setShowEditorModal] = useAtom(showEditorModalAtom);

  function handleAdd() {
    setShowEditorModal(true);
  }

  return (
    <div className="navbar">
      <label
        htmlFor="my-drawer-2"
        className="btn-ghost drawer-button btn lg:hidden"
      >
        {hamburgerIcon}
      </label>
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">vocab</a>
      </div>
      <div className="flex space-x-4">
        <button className="btn-ghost btn" onClick={handleAdd}>
          {plusIcon}
        </button>
        {props.collectionId && <Menu collectionId={props.collectionId} />}
      </div>
    </div>
  );
}
