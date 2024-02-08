import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { omit, cloneDeep } from "lodash";
import { restApi } from "@/paths";
import { SignupResponse } from "@bookings-server/types";
import { UserFromJWT, UserSession } from "@/types";

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
        const cookies = res.headers.getSetCookie();
        const refreshTokenCookie = cookies.find((cookie: string) =>
          cookie.includes("refreshToken")
        );
        if (!accessToken || !refreshTokenCookie) {
          return null;
        }

        const decodedAccessToken = jwtDecode(accessToken);

        // If no error and we have user data, return it
        if (res.ok && user) {
          const userInCallbacks = {
            ...user,
            accessToken,
            refreshTokenCookie,
            expiresAt: decodedAccessToken.exp,
          };
          return userInCallbacks;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    // This happens before the 'session' callback. Need to save our own user so it can be used later on
    // https://stackoverflow.com/questions/64576733/where-and-how-to-change-session-user-object-after-signing-in/64595973#64595973
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user as UserFromJWT;
        return token;
      }
      if (
        Math.floor(Date.now() / 1000) < (token.user as UserFromJWT).expiresAt
      ) {
        return token;
      } else {
        // If the access token has expired, try to refresh it
        try {
          if (!(token.user as UserFromJWT)?.refreshTokenCookie) {
            throw new Error("No refresh token cookie");
          }

          // Using our own auth service
          const res = await fetch(restApi.auth.refresh(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: (token.user as UserFromJWT).refreshTokenCookie,
            },
          });

          const tokens = await res.json();
          if (!res.ok) throw tokens;

          const cookies = res.headers.getSetCookie();
          const refreshTokenCookie = cookies.find((cookie: string) =>
            cookie.includes("refreshToken")
          );

          if (!tokens.accessToken || !refreshTokenCookie) {
            throw new Error("No access token or refresh token cookie");
          }
          const decodedAccessToken = jwtDecode(tokens.accessToken);

          const newToken = {
            ...token, // Keep the previous token properties
            user: {
              ...(token.user as UserFromJWT),
              accessToken: tokens.accessToken,
              refreshTokenCookie,
              expiresAt: decodedAccessToken.exp,
            },
          };

          return newToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          return {
            ...token,
            user: null,
            error: "RefreshAccessTokenError" as const,
          };
        }
      }
    },
    async session({ session, token }) {
      // the session object will be available on the client-side
      (session as UserSession).error = token.error as string;
      // override the default session.user to be able to access it in useSession()
      session.user = cloneDeep(
        omit(token.user as UserFromJWT, "refreshTokenCookie")
      );
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
