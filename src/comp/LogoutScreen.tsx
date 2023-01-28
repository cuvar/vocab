import { signIn } from "next-auth/react";

export default function LogoutScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold">Not signed in</h1>
        <button
          className="hover:underline active:text-blue-500"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
