import Head from "next/head";
import Toast from "./Toast";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { useAtom } from "jotai";
import AddWordEditor from "./AddWordEditor";
import Navbar from "./Navbar";
import Drawer from "./Drawer";

interface Props {
  children: React.ReactNode;
}

export default function SiteWrapper(props: Props) {
  const [toastText, _] = useAtom(toastTextAtom);
  const [toastType, __] = useAtom(toastTypeAtom);

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="description" content="Vocabulary learning tool" />
        <link rel="icon" href="/dyme.png" />
      </Head>

      <Drawer>
        <main className="flex min-h-screen flex-col items-center justify-start">
          <Navbar />
          {props.children}
          <Toast
            msg={toastText}
            mode={toastType}
            visible={toastText.length > 0}
          />
          <AddWordEditor />
        </main>
      </Drawer>
    </>
  );
}
