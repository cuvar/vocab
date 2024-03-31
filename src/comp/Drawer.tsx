import Link from "next/link";
import { useRouter } from "next/router";
import {
  archiveIcon,
  boltIcon,
  calendarIcon,
  cogIcon,
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
  position?: "top" | "bottom";
};
export default function Drawer(props: Props) {
  const router = useRouter();
  const path = router.pathname.split("/")[1];
  const drawerItems: DrawerItem[] = [
    {
      href: "/cards",
      displayName: "Flash cards",
      icon: boltIcon,
    },
    {
      href: "/words",
      displayName: "Words",
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
    {
      href: "/wotd",
      displayName: "WOTD",
      icon: calendarIcon,
    },
    {
      href: "/settings",
      displayName: "Settings",
      icon: cogIcon,
      position: "bottom",
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
        <div className="flex min-h-full flex-col justify-between bg-base-100 text-base-content">
          <ul className="menu w-80 space-y-2 p-4">
            {drawerItems
              .filter((d) => d.position !== "bottom")
              .map((item) => (
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
          <ul className="menu w-80 space-y-2 p-4">
            {drawerItems
              .filter((d) => d.position === "bottom")
              .map((item) => (
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
    </div>
  );
}
