import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import {
  editorModalIdAtom,
  showEditorModalAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import LogoutScreen from "../sites/LogoutScreen";
import Drawer from "./Drawer";
import Editor from "./Editor";
import Navbar from "./Navbar";
import Toast from "./Toast";

type Props = {
  children: React.ReactNode;
};

export default function SiteWrapper(props: Props) {
  const [toastText] = useAtom(toastTextAtom);
  const [toastType] = useAtom(toastTypeAtom);
  const [wordToEdit] = useAtom(wordToEditAtom);
  const [editorModalId] = useAtom(editorModalIdAtom);
  const [showEditorModal] = useAtom(showEditorModalAtom);

  useEffect(() => {
    if (showEditorModal) {
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      window[editorModalId].showModal();
    }
  }, [editorModalId, showEditorModal]);
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

      <Drawer>
        <Navbar />

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
        {showEditorModal && <Editor word={wordToEdit} />}
      </Drawer>
    </>
  );
}
