import { paths, restApi } from "@/paths";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { checkLoggedInAndGetSession } from "@/utils/userServerSession";
import { GetBookingResponse } from "@bookings-server/types";
import { notFound, redirect } from "next/navigation";

const getBookings = async () => {
  const session = await checkLoggedInAndGetSession();
  const user = session.user;

  const res = await fetch(restApi.bookings.list(), {
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
    <div>
      <h1>Manage your bookings</h1>
      <p>You can review and manage your bookings here.</p>
      <section>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.bookingNumber} className="m-2">
              <div>
                Booking number:{" "}
                <a href={paths.myBookingDetail(booking.bookingNumber)}>
                  {booking.bookingNumber}
                </a>
              </div>
              <div>
                Departure:{" "}
                {formatDateToDisplay(new Date(booking.trip.startDate))}
              </div>
              <div>
                Return: {formatDateToDisplay(new Date(booking.trip.endDate))}
              </div>
              <div>
                Passengers:{" "}
                {booking.guestNames.map((guest) => (
                  <p key={guest}>&quot;{guest}&quot;</p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
