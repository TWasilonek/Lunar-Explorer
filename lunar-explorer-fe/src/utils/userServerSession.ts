import { redirect } from "next/navigation";
import { paths } from "@/paths";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserSession } from "@/types";

export const checkLoggedInAndGetSession = async (): Promise<UserSession> => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect(paths.auth.login());
  }

  return session as UserSession;
};
