import Link from "next/link";
import { hatIcon, listIcon, sparklesIcon } from "../utils/icons";

interface Props {
  children: React.ReactNode;
}
export default function Drawer(props: Props) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-full">{props.children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 space-y-2 bg-base-200 p-4 text-base-content">
          <li>
            <Link href="/learn">{hatIcon} Learn</Link>
          </li>
          <li>
            <Link href="/words">{listIcon} All words</Link>
          </li>
          <li>
            <Link href="/generate">{sparklesIcon} Generator</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}