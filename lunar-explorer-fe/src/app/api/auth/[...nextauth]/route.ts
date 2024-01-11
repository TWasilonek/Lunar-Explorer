import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { restApi } from "@/paths";
import { SignupResponse } from "@bookings-server/types";
import { UserFromJWT } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Sign In",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

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
        // console.log("headers from response", res.headers);
        // console.log("response from login", user);
        const accessToken = res.headers.get("x-access-token");
        //   const refreshToken = res.headers.get("set-cookie");

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
      // TODO: custom session expiration?
      if (user) {
        token.user = user as UserFromJWT;
      }
      //   console.log("jwt: token ", token);
      return token;
    },
    async session({ session, token }) {
      // override the default session.user to be able to access it in useSession()
      // token.user has been saved in the jwt() callback
      // console.log("session callback: session", session);
      // console.log("sessions callback: token", token);
      session.user = token.user as UserFromJWT;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signIn",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: null // If set, new users will be directed here on first sign in
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
