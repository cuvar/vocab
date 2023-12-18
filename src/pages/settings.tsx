import { type NextPage } from "next";
import SiteWrapper from "../comp/SiteWrapper";
import Settings from "../sites/Settings";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <Settings />
    </SiteWrapper>
  );
};

export default SiteLearn;
