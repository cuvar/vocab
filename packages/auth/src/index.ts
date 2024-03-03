import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// import { env } from "../env";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials, req) {
        if (credentials?.username != "env.USERNAME") {
          return null;
        }
        // TODO: FIX
        if (credentials?.password != "env.PASSWORD") {
          return null;
        }

        return { id: "1", name: "cuvar", email: "info@cuvar.dev" };
      },
    }),
  ],
  // callbacks: {
  //   session: (opts) => {
  //     if (!("user" in opts)) throw "unreachable with session strategy";

  //     return {
  //       ...opts.session,
  //       user: {
  //         ...opts.session.user,
  //         id: opts.user.id,
  //       },
  //     };
  //   },
  // },
});
