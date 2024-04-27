import { signOut } from "next-auth/react";
import Link from "next/link";
import { ellipsisIcon, importIcon, signOutIcon } from "../lib/ui/icons";

export default function Menu() {
  function handleLogout() {
    void (async () => {
      await signOut();
    })();
  }

  return (
    <div>
      <div className="dropdown-end dropdown">
        <label tabIndex={0} className="btn-ghost btn">
          {ellipsisIcon}
        </label>
        <ul
          tabIndex={0}
          className={`dropdown-content menu rounded-box z-[1] w-52 border border-base-300 bg-base-200 p-2 shadow`}
        >
          <Link
            className="btn-ghost flex items-center space-x-2 rounded-md px-2 py-2 text-left active:text-blue-500"
            href="/import"
          >
            <span>{importIcon}</span>
            <span>JSON import</span>
          </Link>
          <button
            className="btn-ghost flex items-center space-x-2 rounded-md px-2 py-2 text-left active:text-blue-500"
            onClick={handleLogout}
          >
            <span>{signOutIcon}</span>
            <span>Log out</span>
          </button>
        </ul>
      </div>
    </div>
  );
}
