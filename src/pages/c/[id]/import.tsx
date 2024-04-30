import { type NextPage } from "next";
import { useRouter } from "next/router";
import SiteWrapper from "../../../comp/SiteWrapper";
import JsonImport from "../../../sites/collection/JsonImport";

const SiteWords: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";

  return (
    <SiteWrapper collectionId={collectionId}>
      <JsonImport collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteWords;
