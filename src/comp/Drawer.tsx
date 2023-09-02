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
          <li>
            <Link href="/learn" className={path == "learn" ? `active` : ""}>
              {hatIcon} Learn
            </Link>
          </li>
          <li>
            <Link href="/cards" className={path == "cards" ? `active` : ""}>
              {archiveIcon} Flash cards
            </Link>
          </li>
          <li>
            <Link href="/words" className={path == "words" ? `active` : ""}>
              {listIcon} All words
            </Link>
          </li>
          <li>
            <Link
              href="/generate"
              className={path == "generate" ? `active` : ""}
            >
              {sparklesIcon} Generator
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
