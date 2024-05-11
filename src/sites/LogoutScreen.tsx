import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LogoutScreen() {
  function handleLogin() {
    void (async () => {
      await signIn();
    })();
  }

  return (
    <div className="flex h-full min-h-screen flex-col justify-between text-gray-100 ">
      <div className="flex justify-end px-4 py-4">
        <button className="btn-ghost btn" onClick={handleLogin}>
          Sign in
        </button>
      </div>
      <main className="bg-panal-500 flex h-full flex-col items-center px-5">
        <div className="bg-panal-700 flex h-screen w-screen flex-col items-center justify-center sm:flex-row">
          {/* left */}
          <div className="flex h-full w-full flex-col justify-center space-y-10 px-10 ">
            <h1 className="text-3xl font-semibold sm:text-4xl md:text-5xl">
              vocab
            </h1>
            <h2 className="text-xl font-semibold sm:text-2xl md:text-3xl">
              A self-hosted flash cards app for learning new stuff
            </h2>
            <div className="flex space-x-4">
              <Link
                href={"https://github.com/cuvar/vocab"}
                className="underline hover:text-secondary"
                target="_blank"
              >
                GitHub
              </Link>
              <Link
                href={"https://vocab-docs.vercel.app"}
                className="underline hover:text-secondary"
                target="_blank"
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
