import { type NextPage } from "next";
import Generator from "../comp/Generator";
import SiteWrapper from "../comp/SiteWrapper";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <Generator />
    </SiteWrapper>
  );
};

export default SiteLearn;
