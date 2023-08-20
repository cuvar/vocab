import { signOut } from "next-auth/react";
import { signOutIcon } from "../utils/icons";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="flex-1">
        <a className="btn-ghost btn text-xl normal-case">vocab</a>
      </div>
      <button
        className="btn-ghost btn mr-4 active:text-blue-500"
        onClick={() => signOut()}
      >
        {signOutIcon}
      </button>
    </div>
  );
}
