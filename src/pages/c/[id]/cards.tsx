import { type NextPage } from "next";
import { useRouter } from "next/router";
import SiteWrapper from "../../../comp/SiteWrapper";
import FlashCards from "../../../sites/collection/FlashCards";

const SiteLearn: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";

  return (
    <SiteWrapper>
      <FlashCards collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteLearn;
