import { type NextPage } from "next";
import FlashCards from "../comp/FlashCards";
import SiteWrapper from "../comp/SiteWrapper";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <FlashCards />
    </SiteWrapper>
  );
};

export default SiteLearn;
