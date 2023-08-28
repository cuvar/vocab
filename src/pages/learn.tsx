import { type NextPage } from "next";
import Generator from "../comp/Generator";
import Learned from "../comp/Learned";
import SiteWrapper from "../comp/SiteWrapper";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <Learned />
    </SiteWrapper>
  );
};

export default SiteLearn;
