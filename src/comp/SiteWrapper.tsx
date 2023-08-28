import Head from "next/head";
import Toast from "./Toast";
import { toastTextAtom, toastTypeAtom } from "../server/store";
import { useAtom } from "jotai";
import AddWordEditor from "./AddWordEditor";
import Navbar from "./Navbar";
import Drawer from "./Drawer";
import { useSession } from "next-auth/react";
import LogoutScreen from "./LogoutScreen";

interface Props {
  children: React.ReactNode;
}

export default function SiteWrapper(props: Props) {
  const [toastText, _] = useAtom(toastTextAtom);
  const [toastType, __] = useAtom(toastTypeAtom);

  const { data } = useSession();
  if (!data?.user) {
    return <LogoutScreen />;
  }

  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="description" content="Vocabulary learning tool" />
        <link rel="icon" href="/dyme.png" />
      </Head>

      <Drawer>
        <Navbar />

        <div className="flex w-full flex-col items-center justify-start">
          <main className="flex min-h-screen w-full flex-col items-center justify-center sm:w-5/6 md:w-3/4 lg:w-5/6 xl:w-3/4">
            <div className="flex h-full w-full justify-center">
              {props.children}
            </div>
          </main>
        </div>
        <Toast
          msg={toastText}
          mode={toastType}
          visible={toastText.length > 0}
        />
        <AddWordEditor />
      </Drawer>
    </>
  );
}
