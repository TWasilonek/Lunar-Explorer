import { PageHeader } from "@/components/PageHeader";
import { BookingsList } from "@/modules/bookings/BookingsList";
import { paths, restApi } from "@/paths";
import { formatCalendarDate } from "@/utils/dateUtils";
import { checkLoggedInAndGetSession } from "@/utils/userServerSession";
import { GetBookingResponse } from "@bookings-server/types";
import { notFound, redirect } from "next/navigation";

const getBookings = async () => {
  const session = await checkLoggedInAndGetSession();
  const user = session.user;

  const res = await fetch(restApi.user.listBookings(), {
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

export default async function UserBookingsPage() {
  await checkLoggedInAndGetSession();
  const bookings: GetBookingResponse[] = await getBookings();

  return (
    <div className="p-4">
      <PageHeader title="Manage your bookings" />
      <BookingsList bookings={bookings} />
    </div>
  );
}
