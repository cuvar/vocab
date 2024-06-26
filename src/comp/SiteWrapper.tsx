import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import {
  editorModalIdAtom,
  messageModalIdAtom,
  showEditorModalAtom,
  showMessageModalAtom,
  tagToDeleteAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import LogoutScreen from "../sites/LogoutScreen";
import Drawer from "./Drawer";
import Editor from "./Editor";
import MessageModal from "./MessageModal";
import Navbar from "./Navbar";
import Toast from "./Toast";

type Props = {
  children: React.ReactNode;
  disableDrawer?: boolean;
  collectionId?: string;
};

export default function SiteWrapper(props: Props) {
  const [toastText] = useAtom(toastTextAtom);
  const [toastType] = useAtom(toastTypeAtom);
  const [wordToEdit] = useAtom(wordToEditAtom);
  const [tagToDelete] = useAtom(tagToDeleteAtom);
  const [editorModalId] = useAtom(editorModalIdAtom);
  const [showEditorModal, setShowEditorModal] = useAtom(showEditorModalAtom);
  const [messageModalId] = useAtom(messageModalIdAtom);
  const [showMessageModal, setShowMessageModal] = useAtom(showMessageModalAtom);

  useEffect(() => {
    if (!props.collectionId) return;

    if (showEditorModal && !showMessageModal) {
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      window[editorModalId].showModal();
    }
    if (showMessageModal && !showEditorModal) {
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      window[messageModalId].showModal();
    }
    if (showEditorModal && showMessageModal) {
      setShowEditorModal(false);
      setShowMessageModal(false);
    }
  }, [
    editorModalId,
    messageModalId,
    setShowEditorModal,
    setShowMessageModal,
    showEditorModal,
    showMessageModal,
  ]);

  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="description" content="Vocabulary learning tool" />
        <link rel="icon" href="/icon-192x192.png" />
      </Head>

      <Drawer
        disableDrawer={props.disableDrawer}
        collectionId={props.collectionId}
      >
        <Navbar collectionId={props.collectionId} />

        <div className="flex w-full flex-col items-center justify-start">
          <main className="flex min-h-screen w-full flex-col items-center justify-center sm:w-5/6 md:w-3/4 lg:w-5/6 xl:w-3/4">
            <div className="flex h-full w-full justify-center py-4">
              {props.children}
            </div>
          </main>
        </div>
        <Toast
          msg={toastText}
          mode={toastType}
          visible={toastText.length > 0}
        />
        {showEditorModal && props.collectionId && (
          <Editor word={wordToEdit} collectionId={props.collectionId} />
        )}
        {showMessageModal && <MessageModal tag={tagToDelete} />}
      </Drawer>
    </>
  );
}
