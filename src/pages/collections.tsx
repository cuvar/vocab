import { type NextPage } from "next";
import SiteWrapper from "../comp/SiteWrapper";
import Collections from "../sites/Collections";

const SiteCollections: NextPage = () => {
  return (
    <SiteWrapper disableDrawer>
      <Collections />
    </SiteWrapper>
  );
};

export default SiteCollections;
