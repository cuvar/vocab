import { type NextPage } from "next";
import JsonImport from "../sites/JsonImport";
import SiteWrapper from "../comp/SiteWrapper";

const SiteWords: NextPage = () => {
  return (
    <SiteWrapper>
      <JsonImport />
    </SiteWrapper>
  );
};

export default SiteWords;
