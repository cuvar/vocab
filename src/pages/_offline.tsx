import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import SiteWrapper from "../comp/SiteWrapper";
import LogoutScreen from "../sites/LogoutScreen";

const Home: NextPage = () => {
  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  return (
    <SiteWrapper>
      <div>
        <h1>Unfortunately, you&apos;re oufline :(</h1>
      </div>
    </SiteWrapper>
  );
};

export default Home;
