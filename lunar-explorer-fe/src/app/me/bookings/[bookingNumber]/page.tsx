import { notFound, redirect } from "next/navigation";
import { paths, restApi } from "@/paths";
import { GetBookingResponse, RoomType } from "@bookings-server/types";
import { checkLoggedInAndGetSession } from "@/utils/userServerSession";

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

  const renderSeats = (seats: string[]) => {
    return seats.map((seat) => (
      <span key={seat}>&nbsp;&quot;{seat}&quot;&nbsp;</span>
    ));
  };

  return (
    <div>
      <h1>Your trip to the Moon!</h1>

      <section>
        <h2>Booking details</h2>

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

      <section>
        <h2>Flights</h2>
        <h3>Departure</h3>
        <ul>
          <li>
            <strong>Departure time:</strong>{" "}
            {booking.trip.flightToMoon.departureTime}
          </li>
          <li>
            <strong>Origin port:</strong>{" "}
            {booking.trip.flightToMoon.originPort.name}
          </li>
          <li>
            <strong>Spaceship:</strong>{" "}
            {booking.trip.flightToMoon.spaceship.model} by{" "}
            {booking.trip.flightToMoon.spaceship.manufacturer.name}
          </li>
          <li>
            <strong>Arrival time:</strong>{" "}
            {booking.trip.flightToMoon.arrivalTime}
          </li>
          <li>
            <strong>Seats:</strong>
            {renderSeats(booking.trip.flightToMoon.seats)}
          </li>
        </ul>

        <h3>Return</h3>
        <ul>
          <li>
            <strong>Departure time:</strong>{" "}
            {booking.trip.flightToEarth.departureTime}
          </li>
          <li>
            <strong>Origin port:</strong>{" "}
            {booking.trip.flightToEarth.originPort.name}
          </li>
          <li>
            <strong>Spaceship:</strong>{" "}
            {booking.trip.flightToEarth.spaceship.model} by{" "}
            {booking.trip.flightToEarth.spaceship.manufacturer.name}
          </li>
          <li>
            <strong>Arrival time:</strong>{" "}
            {booking.trip.flightToEarth.arrivalTime}
          </li>
          <li>
            <strong>Seats:</strong>
            {renderSeats(booking.trip.flightToEarth.seats)}
          </li>
        </ul>
      </section>
      <pre>{params.bookingNumber}</pre>
    </div>
  );
}
