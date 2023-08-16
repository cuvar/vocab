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
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn-ghost btn text-xl normal-case">vocab</a>
        </div>
        <button
          className="btn-ghost btn mr-4 active:text-blue-500"
          onClick={() => signOut()}
        >
          {signOutIcon}
        </button>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-start">
        {props.children}
      </main>
    </>
  );
}
