import { UpdateUserProfileForm } from "@/modules/profile";
import { paths, restApi } from "@/paths";
import { UserSession } from "@/types";
import { checkLoggedInAndGetSession } from "@/utils/userServerSession";
import { UserProfile } from "@bookings-server/types";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const getProfile = async (session: UserSession) => {
  const user = session.user;

  const res = await fetch(restApi.user.profile(), {
    method: "GET",
    headers: {
      authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json", // This MUST be included!
    },
  });
  const json = await res.json();

  if (res.ok) {
    return json;
  }
  if (res.status === 401 || res.status === 403) {
    redirect(paths.auth.login());
  }
  notFound();
};

export default async function UserProfilePage() {
  const session = await checkLoggedInAndGetSession();
  const profile: UserProfile = await getProfile(session);

  return (
    <div>
      <h1>
        Welcome {profile.firstName} {profile.lastName}
      </h1>

      <h3>
        <Link href={paths.myBookings()}>Your bookings</Link>
      </h3>

      <section>
        <h2>Update your details</h2>
        <UpdateUserProfileForm profile={profile} />
      </section>
    </div>
  );
}
