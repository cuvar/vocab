import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import Archive from "../sites/Archive";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <Archive />
    </SiteWrapper>
  );
};

export default SiteLearn;
