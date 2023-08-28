import { type NextPage } from "next";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import LogoutScreen from "../comp/LogoutScreen";
import Generator from "../comp/Generator";
import Learned from "../comp/Learned";
import AllWords from "../comp/AllWords";
import SiteWrapper from "../comp/SiteWrapper";
import Link from "next/link";
import { hatIcon, listIcon, sparklesIcon } from "../utils/icons";

type Tab = "generator" | "list" | "all";
type TabDisplay = "Generator" | "Learned" | "All words";

const TABS: Record<Tab, TabDisplay> = {
  list: "Learned",
  generator: "Generator",
  all: "All words",
} as const;

const Home: NextPage = () => {
  const [tab, setTab] = useState<Tab>("list");
  const tabContainerRef = useRef(null);
  // const initDB = api.word.initDB.useMutation();

  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  function switchTab(ev: React.MouseEvent<HTMLButtonElement>, clicked: Tab) {
    if (tabContainerRef.current) {
      // @ts-ignore
      [...tabContainerRef.current.children].forEach((e: any) => {
        e.classList.remove("tab-active");
      });
      // @ts-ignore
      ev.target.classList.add("tab-active");
    }
    setTab(clicked);
  }

  return (
    <SiteWrapper>
      <ul className="flex flex-col space-y-6">
        <li className="flex">
          <Link
            href="/learn"
            className="btn-ghost btn flex h-full w-full items-center space-x-2 py-10 text-lg"
          >
            <span>{hatIcon}</span>
            <span>Learn Mode</span>
          </Link>
        </li>
        <li className="flex">
          <Link
            href="/words"
            className="btn-ghost btn flex h-full w-full items-center space-x-2 py-10 text-lg "
          >
            <span>{listIcon}</span>
            <span>All words</span>
          </Link>
        </li>
        <li className="flex">
          <Link
            href="/generate"
            className="btn-ghost btn flex h-full w-full items-center space-x-2 py-10 text-lg "
          >
            <span>{sparklesIcon}</span>
            <span>Generate</span>
          </Link>
        </li>
      </ul>
    </SiteWrapper>
  );
};

export default Home;
