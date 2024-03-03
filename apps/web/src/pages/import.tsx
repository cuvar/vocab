import type { NextPage } from "next";

import SiteWrapper from "../comp/SiteWrapper";
import JsonImport from "../sites/JsonImport";

const SiteWords: NextPage = () => {
  return (
    <SiteWrapper>
      <JsonImport />
    </SiteWrapper>
  );
};

export default SiteWords;
