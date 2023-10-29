import { type NextPage } from "next";
import Tags from "../comp/Tags";
import SiteWrapper from "../comp/SiteWrapper";

const SiteWords: NextPage = () => {
  return (
    <SiteWrapper>
      <Tags />
    </SiteWrapper>
  );
};

export default SiteWords;
