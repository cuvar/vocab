import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { chevronDown } from "~/lib/ui/icons";

export default function LogoutScreen() {
  function handleLogin() {
    void (async () => {
      await signIn();
    })();
  }

  function handleScrollTo() {
    const el = document.querySelector("#sec2");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <div className="h-full text-gray-100">
      <main className="flex h-full w-full flex-col items-center">
        <section className="mb-20 flex h-screen flex-col justify-around bg-[url('/res/landing-scene.svg')] bg-cover bg-center bg-no-repeat px-5">
          <div className="flex w-full justify-end px-4 py-4">
            <button
              className="btn-ghost btn text-base-300"
              onClick={handleLogin}
            >
              Sign in
            </button>
          </div>
          <div className="flex h-full w-screen flex-col items-center justify-center">
            {/* left */}
            <div className="flex h-full w-full flex-col justify-center space-y-10 px-10">
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
          <div className="m-5 h-5 text-center active:text-secondary">
            <button onClick={handleScrollTo}>{chevronDown}</button>
          </div>
        </section>
        {/* images */}
        <section className="my-5 w-full max-w-5xl py-10 px-5" id="sec2">
          <div className="flex w-full flex-col space-y-20 px-6">
            <div className="flex w-full flex-col items-center justify-between md:flex-row">
              <div className="my-10 flex w-full justify-center md:mx-4 md:my-0 lg:mx-20">
                <p className="text-center text-3xl font-bold text-primary">
                  A simple flash cards mode...
                </p>
              </div>
              <Image
                src="/res/flash-cards.png"
                width="500"
                height="500"
                alt=""
                className="rounded-3xl border border-white p-2"
              />
            </div>
            <div className="flex w-full flex-col-reverse items-center justify-between md:flex-row">
              <Image
                src="/res/list.png"
                width="500"
                height="500"
                alt=""
                className="rounded-3xl border border-white p-2"
              />
              <div className="my-10 flex w-full justify-center md:mx-4 md:my-0 lg:mx-20">
                <p className="text-center text-3xl font-bold text-accent">
                  lovely entry management...
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-between md:flex-row">
              <div className="my-10 flex w-full justify-center md:my-0 md:mx-4 lg:mx-20">
                <p className="text-center text-3xl font-bold text-secondary">
                  ...and lots of convenience features!
                </p>
              </div>
              <Image
                src="/res/generator.png"
                width="500"
                height="500"
                alt=""
                className="rounded-3xl border border-white p-2"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-20 text-center">
          <p className="text-xl font-bold">
            Check out the{" "}
            <Link
              href={"https://vocab-docs.vercel.app"}
              className="underline hover:text-secondary"
              target="_blank"
            >
              docs
            </Link>
            !
          </p>
        </section>
      </main>
      <footer className="w-full bg-base-200 py-10">
        <div className="flex justify-center py-4">
          <p className="text-sm">
            Made with ❤️ by{" "}
            <Link
              href="https://github.com/cuvar"
              className="underline hover:text-secondary"
            >
              cuvar
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
