import { type NextPage } from "next";
import { useRouter } from "next/router";
import CollectionSettings from "~/sites/CollectionSettings";
import SiteWrapper from "../../../comp/SiteWrapper";

const SiteSettings: NextPage = () => {
  const router = useRouter();
  const collectionId =
    typeof router.query.id === "string" ? router.query.id : "";

  return (
    <SiteWrapper collectionId={collectionId}>
      <CollectionSettings collectionId={collectionId} />
    </SiteWrapper>
  );
};

export default SiteSettings;
