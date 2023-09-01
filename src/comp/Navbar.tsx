import { hamburgerIcon, plusIcon } from "../utils/icons";
import { modalIdAtom } from "../server/store";
import { useAtom } from "jotai";
import Menu from "./Menu";

export default function Navbar() {
  const [addModal, _] = useAtom(modalIdAtom);

  function handleAdd() {
    // @ts-ignore
    window[addModal].showModal();
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
        <Menu />
      </div>
    </div>
  );
}
