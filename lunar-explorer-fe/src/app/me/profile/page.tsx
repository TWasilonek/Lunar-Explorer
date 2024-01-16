import { notFound, redirect } from "next/navigation";
import { Link } from "@nextui-org/link";
import { PageHeader } from "@/components/PageHeader";
import { UpdateUserProfileForm } from "@/modules/profile";
import { paths, restApi } from "@/paths";
import { UserSession } from "@/types";
import { checkLoggedInAndGetSession } from "@/utils/userServerSession";
import { UserProfile } from "@bookings-server/types";

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
    <div className="p-4">
      <PageHeader
        title={
          <>
            <div>
              Welcome {profile.firstName} {profile.lastName}
            </div>
            <Link href={paths.myBookings()}>Your bookings</Link>
          </>
        }
      />

      <section className="mx-auto max-w-md">
        <h2 className="text-2xl text-center mb-4">Update your details</h2>
        <UpdateUserProfileForm profile={profile} />
      </section>
    </div>
  );
}
