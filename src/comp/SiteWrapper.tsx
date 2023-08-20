import { signOut } from "next-auth/react";
import Head from "next/head";
import { signOutIcon } from "../utils/icons";

interface Props {
  children: React.ReactNode;
}

export default function SiteWrapper(props: Props) {
  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="description" content="Vocabulary learning tool" />
        <link rel="icon" href="/dyme.png" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-start">
        {props.children}
      </main>
    </>
  );
}
