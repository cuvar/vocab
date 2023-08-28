import { type NextPage } from "next";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import LogoutScreen from "../comp/LogoutScreen";
import Generator from "../comp/Generator";
import Learned from "../comp/Learned";
import AllWords from "../comp/AllWords";
import SiteWrapper from "../comp/SiteWrapper";

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
      <div className="flex h-full w-full flex-col items-center">
        <div className="sticky top-0 flex w-full flex-col items-center justify-center space-y-8 bg-base-100 pb-10">
          <div className="tabs tabs-boxed" ref={tabContainerRef}>
            {(Object.keys(TABS) as Tab[]).map((e) => {
              return (
                <button
                  key={e}
                  onClick={(ev) => switchTab(ev, e)}
                  className={`tab ${e == "list" && "tab-active"}`}
                >
                  {TABS[e]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex h-full w-full justify-center">
          {tab == "generator" && <Generator />}
          {tab == "list" && <Learned />}
          {tab == "all" && <AllWords />}
        </div>
      </div>
    </SiteWrapper>
  );
};

export default Home;
