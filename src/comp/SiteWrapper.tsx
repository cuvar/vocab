import { signOut } from "next-auth/react";
import Head from "next/head";
import { signOutIcon } from "../utils/icons";
import Toast from "./Toast";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { useAtom } from "jotai";

interface Props {
  children: React.ReactNode;
}

export default function SiteWrapper(props: Props) {
  const [toastText, setToastText] = useAtom(toastTextAtom);
  const [toastType, setToastType] = useAtom(toastTypeAtom);

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="description" content="Vocabulary learning tool" />
        <link rel="icon" href="/dyme.png" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-start">
        {props.children}
        <Toast
          msg={toastText}
          mode={toastType}
          visible={toastText.length > 0}
        />
      </main>
    </>
  );
}
