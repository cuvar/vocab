import Link from "next/link";
import { useRouter } from "next/router";
import {
  archiveIcon,
  boltIcon,
  hatIcon,
  listIcon,
  sparklesIcon,
  tagIcon,
} from "../utils/icons";

type Props = {
  children: React.ReactNode;
};

type DrawerItem = {
  href: string;
  displayName: string;
  icon: React.ReactNode;
};
export default function Drawer(props: Props) {
  const router = useRouter();
  const path = router.pathname.split("/")[1];
  const drawerItems: DrawerItem[] = [
    {
      href: "/learn",
      displayName: "Learn",
      icon: hatIcon,
    },
    {
      href: "/cards",
      displayName: "Flash cards",
      icon: boltIcon,
    },
    {
      href: "/words",
      displayName: "All words",
      icon: listIcon,
    },
    {
      href: "/generate",
      displayName: "Generator",
      icon: sparklesIcon,
    },
    {
      href: "/tags",
      displayName: "Tags",
      icon: tagIcon,
    },
    {
      href: "/archive",
      displayName: "Archive",
      icon: archiveIcon,
    },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex w-full flex-col items-center">
        {props.children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 space-y-2 bg-base-100 p-4 text-base-content">
          {drawerItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-row items-center space-x-1 rounded-lg py-2 px-4 ${
                  path == item.href.slice(1) ? `active` : ""
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.displayName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
