import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import WordOfTheDay from "../sites/WordOfTheDay";

const SiteLearn: NextPage = () => {
  return (
    <SiteWrapper>
      <WordOfTheDay />
    </SiteWrapper>
  );
};

export default SiteLearn;
