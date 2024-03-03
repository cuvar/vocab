import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import Generator from "../sites/Generator";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <Generator />
    </SiteWrapper>
  );
};

export default SiteLearn;
