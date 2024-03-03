import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import AllWords from "../sites/AllWords";

const SiteWords: NextPage = () => {
  return (
    <SiteWrapper>
      <AllWords />
    </SiteWrapper>
  );
};

export default SiteWords;
