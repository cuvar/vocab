import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import LogoutScreen from "../comp/LogoutScreen";
import SiteWrapper from "../comp/SiteWrapper";
import Link from "next/link";
import { hatIcon, listIcon, sparklesIcon } from "../utils/icons";

const Home: NextPage = () => {
  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  return (
    <SiteWrapper>
      <div>
        <h1>Unfortunately, you're oufline :(</h1>
      </div>
    </SiteWrapper>
  );
};

export default Home;
