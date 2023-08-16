import { signOut } from "next-auth/react";
import Head from "next/head";

interface Props {
  children: React.ReactNode;
}

export default function SiteWrapper(props: Props) {
  return (
    <>
      <Head>
        <title>Vocab</title>
        <meta name="description" content="Vocabulary learning tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn-ghost btn text-xl normal-case">vocab</a>
        </div>
        <button
          className="mr-4 p-4 hover:underline active:text-blue-500"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-start">
        {props.children}
      </main>
    </>
  );
}
