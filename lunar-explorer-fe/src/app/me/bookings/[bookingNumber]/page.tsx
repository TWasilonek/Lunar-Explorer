import { notFound, redirect } from "next/navigation";
import { Divider } from "@nextui-org/divider";
import { paths, restApi } from "@/paths";
import { GetBookingResponse, RoomType } from "@bookings-server/types";
import { checkLoggedInAndGetSession } from "@/utils/userServerSession";
import { PageHeader } from "@/components/PageHeader";
import { BookedFlightDetails } from "@/modules/bookings/BookedFlitghDetails";
import { PageContainer } from "@/components/PageContainer";

const getBooking = async (bookingNumber: string) => {
  const session = await checkLoggedInAndGetSession();

  const user = session.user;
  const res = await fetch(restApi.bookings.getByBookingNumber(bookingNumber), {
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

type Props = {
  params: {
    bookingNumber: string;
  };
};

export default async function UserBookingDetailsPage({ params }: Props) {
  await checkLoggedInAndGetSession();
  const booking: GetBookingResponse = await getBooking(params.bookingNumber);

  if (!booking) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="p-4">
        <PageHeader title="You trip to the Moon" />

        <section>
          <h2 className="text-2xl mb-4">Booking details</h2>
          <Divider className="my-4" />
          <ul>
            <li>
              <strong>Booking number:</strong> {booking.bookingNumber}
            </li>
            <li>
              <strong>Passengers:</strong> {booking.guestNames.join(", ")}
            </li>
            <li>
              <strong>Room type:</strong>{" "}
              {booking.room.capacity === 1 ? RoomType.SINGLE : RoomType.DOUBLE}
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl mb-4">Flights</h2>
          <Divider className="my-4" />

          <h3 className="text-xl mb-4">To the Moon</h3>
          <BookedFlightDetails flight={booking.trip.flightToMoon} />

          <h3 className="text-xl mt-8 mb-4">Back to Earth</h3>
          <BookedFlightDetails flight={booking.trip.flightToEarth} />
        </section>
      </div>
    </PageContainer>
  );
}
