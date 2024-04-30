import { type NextPage } from "next";
import { useRouter } from "next/router";
import SiteWrapper from "../../../comp/SiteWrapper";
import WordOfTheDay from "../../../sites/collection/WordOfTheDay";

const SiteLearn: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";

  return (
    <SiteWrapper collectionId={collectionId}>
      <WordOfTheDay collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteLearn;
