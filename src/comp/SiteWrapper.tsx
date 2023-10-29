import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import {
  modalIdAtom,
  showModalAtom,
  toastTextAtom,
  toastTypeAtom,
  wordToEditAtom,
} from "../server/store";
import Drawer from "./Drawer";
import Editor from "./Editor";
import LogoutScreen from "./LogoutScreen";
import Navbar from "./Navbar";
import Toast from "./Toast";

type Props = {
  children: React.ReactNode;
};

export default function SiteWrapper(props: Props) {
  const [toastText] = useAtom(toastTextAtom);
  const [toastType] = useAtom(toastTypeAtom);
  const [wordToEdit] = useAtom(wordToEditAtom);
  const [modalId] = useAtom(modalIdAtom);
  const [showModal] = useAtom(showModalAtom);

  useEffect(() => {
    if (showModal) {
      // eslint-disable-next-line
      // @ts-ignore
      // eslint-disable-next-line
      window[modalId].showModal();
    }
  }, [modalId, showModal]);
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
        {showModal && <Editor word={wordToEdit} />}
      </Drawer>
    </>
  );
}
