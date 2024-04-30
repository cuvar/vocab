import { type NextPage } from "next";
import { useRouter } from "next/router";
import SiteWrapper from "~/comp/SiteWrapper";
import AllWords from "~/sites/AllWords";

const SiteCollections: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";
  return (
    <SiteWrapper>
      <AllWords collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteCollections;
