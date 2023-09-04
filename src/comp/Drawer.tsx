import Link from "next/link";
import { archiveIcon, hatIcon, listIcon, sparklesIcon } from "../utils/icons";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
}
export default function Drawer(props: Props) {
  const router = useRouter();
  const path = router.pathname.split("/")[1];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content w-full">{props.children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 space-y-2 bg-base-100 p-4 text-base-content">
          <li className="rounded-lg py-2">
            <Link
              href="/learn"
              className={`flex flex-row space-x-1 ${
                path == "learn" ? `active` : ""
              }`}
            >
              <span>{hatIcon}</span>
              <span>Learn</span>
            </Link>
          </li>
          <li>
            <Link
              href="/cards"
              className={`flex flex-row space-x-1 ${
                path == "cards" ? `active` : ""
              }`}
            >
              <span>{archiveIcon}</span>
              <span>Flash cards</span>
            </Link>
          </li>
          <li>
            <Link
              href="/words"
              className={`flex flex-row space-x-1 ${
                path == "words" ? `active` : ""
              }`}
            >
              <span>{listIcon}</span>
              <span>All words</span>
            </Link>
          </li>
          <li>
            <Link
              href="/generate"
              className={`flex flex-row space-x-1 ${
                path == "generate" ? `active` : ""
              }`}
            >
              <span>{sparklesIcon} </span>
              <span>Generator</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
