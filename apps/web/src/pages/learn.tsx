import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import Learned from "../sites/Learned";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <Learned />
    </SiteWrapper>
  );
};

export default SiteLearn;
