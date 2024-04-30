import { type NextPage } from "next";
import { useRouter } from "next/router";
import SiteWrapper from "../../../comp/SiteWrapper";
import AllWords from "../../../sites/collection/AllWords";

const SiteWords: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";

  return (
    <SiteWrapper collectionId={collectionId}>
      <AllWords collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteWords;
