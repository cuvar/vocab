import type { NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";

import SiteWrapper from "../comp/SiteWrapper";
import LogoutScreen from "../sites/LogoutScreen";
import { hatIcon, listIcon, sparklesIcon } from "../utils/icons";

const Home: NextPage = () => {
  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  return (
    <SiteWrapper>
      <ul className="flex flex-col space-y-6">
        <li className="flex">
          <Link
            href="/learn"
            className="btn btn-ghost flex h-full w-full items-center space-x-2 py-10 text-lg"
          >
            <span>{hatIcon}</span>
            <span>Learn Mode</span>
          </Link>
        </li>
        <li className="flex">
          <Link
            href="/words"
            className="btn btn-ghost flex h-full w-full items-center space-x-2 py-10 text-lg "
          >
            <span>{listIcon}</span>
            <span>All words</span>
          </Link>
        </li>
        <li className="flex">
          <Link
            href="/generate"
            className="btn btn-ghost flex h-full w-full items-center space-x-2 py-10 text-lg "
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
