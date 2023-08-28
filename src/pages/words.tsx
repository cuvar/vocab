import { type NextPage } from "next";
import AllWords from "../comp/AllWords";
import SiteWrapper from "../comp/SiteWrapper";

const SiteWords: NextPage = () => {
  return (
    <SiteWrapper>
      <AllWords />
    </SiteWrapper>
  );
};

export default SiteWords;
