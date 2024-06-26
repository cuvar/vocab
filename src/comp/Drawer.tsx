import Link from "next/link";
import { useRouter } from "next/router";
import { getSettings } from "~/lib/ui/store/settings";
import {
  boltIcon,
  boxIcon,
  calendarIcon,
  cogIcon,
  listIcon,
  sparklesIcon,
} from "../lib/ui/icons";

type Props = {
  children: React.ReactNode;
  disableDrawer?: boolean;
  collectionId?: string;
};

type DrawerItem = {
  href: string;
  displayName: string;
  icon: React.ReactNode;
  position?: "top" | "bottom";
};

export default function Drawer(props: Props) {
  const router = useRouter();
  const drawerItems: DrawerItem[] = [
    {
      href: "/",
      displayName: "Collections",
      icon: boxIcon,
    },
    {
      href: prependCorrectly("/cards"),
      displayName: "Flash cards",
      icon: boltIcon,
    },
    {
      href: prependCorrectly("/words"),
      displayName: "Entries",
      icon: listIcon,
    },
    {
      href: prependCorrectly("/generate"),
      displayName: "Generator",
      icon: sparklesIcon,
    },
    {
      href: prependCorrectly("/settings"),
      displayName: "Collection Settings",
      icon: cogIcon,
      position: "bottom",
    },
  ];

  if (props.collectionId) {
    if (getSettings(props.collectionId).allowWOTD) {
      drawerItems.splice(4, 0, {
        href: prependCorrectly("/wotd"),
        displayName: "WOTD",
        icon: calendarIcon,
      });
    }
  }

  function prependCorrectly(href: string) {
    if (props.collectionId) {
      return `/c/${props.collectionId}${href}`;
    }
    return href;
  }

  function isActive(item: DrawerItem) {
    const key = item.href.split("/").pop()!;
    return router.pathname.endsWith(key) && key.length > 0;
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex w-full flex-col items-center">
        {props.children}
      </div>
      {!props.disableDrawer && (
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
                        isActive(item) ? `active` : ""
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
                        isActive(item) ? `active` : ""
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
      )}
    </div>
  );
}
