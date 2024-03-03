import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import Tags from "../sites/Tags";

const SiteWords: NextPage = () => {
  return (
    <SiteWrapper>
      <Tags />
    </SiteWrapper>
  );
};

export default SiteWords;
