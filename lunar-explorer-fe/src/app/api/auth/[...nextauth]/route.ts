import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { restApi } from "@/paths";
import { SignupResponse } from "@bookings-server/types";
import { UserFromJWT } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Using our own auth service
        const res = await fetch(restApi.auth.login(), {
          method: "POST",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const user: SignupResponse = await res.json();
        const accessToken = res.headers.get("x-access-token");

        // If no error and we have user data, return it
        if (res.ok && user) {
          return {
            ...user,
            accessToken,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    // This happens before the 'session' callback. Need to save our own user so it can be used later on
    // https://stackoverflow.com/questions/64576733/where-and-how-to-change-session-user-object-after-signing-in/64595973#64595973
    async jwt({ token, user }) {
      if (user) {
        token.user = user as UserFromJWT;
      }
      return token;
    },
    async session({ session, token }) {
      // override the default session.user to be able to access it in useSession()
      session.user = token.user as UserFromJWT;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signIn",
  },
  session: {
    strategy: "jwt",
    maxAge: process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN, 10) // this should be the same as the bookings-server JWT_EXPIRES_IN (but in seconds)
      : 60 * 15, // 15 minutes
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
