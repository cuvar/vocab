import { type NextPage } from "next";
import { useRouter } from "next/router";
import SiteWrapper from "../../../comp/SiteWrapper";
import Generator from "../../../sites/collection/Generator";

const SiteLearn: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";

  return (
    <SiteWrapper>
      <Generator collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteLearn;
