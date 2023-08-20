import { signOut } from "next-auth/react";
import { plusIcon, signOutIcon } from "../utils/icons";
import { addModalIdAtom } from "../server/store";
import { useAtom } from "jotai";

export default function Navbar() {
  const [addModal, _] = useAtom(addModalIdAtom);

  function handleAdd() {
    // @ts-ignore
    window[addModal].showModal();
  }

  return (
    <div className="navbar">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">vocab</a>
      </div>
      <div className="flex space-x-4">
        {/* <button className="btn-ghost btn">{penIcon}</button> */}
        <button className="btn-ghost btn" onClick={handleAdd}>
          {plusIcon}
        </button>
        <button
          className="btn-ghost btn mr-4 active:text-blue-500"
          onClick={() => signOut()}
        >
          {signOutIcon}
        </button>
      </div>
    </div>
  );
}
