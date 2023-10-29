import { type NextPage } from "next";
import SiteWrapper from "../comp/SiteWrapper";
import FlashCards from "../sites/FlashCards";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <FlashCards />
    </SiteWrapper>
  );
};

export default SiteLearn;
