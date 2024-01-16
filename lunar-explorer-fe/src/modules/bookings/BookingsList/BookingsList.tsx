import { FaCalendarDay, FaUserFriends } from "react-icons/fa";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { paths } from "@/paths";
import { formatCalendarDate } from "@/utils/dateUtils";
import { GetBookingResponse } from "@bookings-server/types";

import "./BookingsList.css";

type Props = {
  bookings: GetBookingResponse[];
};

export const BookingsList = ({ bookings }: Props) => {
  return (
    <ul className="flex-3 grid grid-cols-3 gap-8">
      {bookings.map((booking) => (
        <Card
          key={booking.bookingNumber}
          as="li"
          classNames={{
            base: "booking-card",
            body: "text-sm",
          }}
        >
          <CardHeader>
            <h4>
              Booking number:{" "}
              <Link href={paths.myBookingDetail(booking.bookingNumber)}>
                {booking.bookingNumber}
              </Link>
            </h4>
          </CardHeader>
          <CardBody>
            <div className="flex gap-2 items-center mb-2">
              <FaCalendarDay />
              <p>
                {" "}
                Departure:{" "}
                {formatCalendarDate(new Date(booking.trip.startDate))}
              </p>
            </div>
            <div className="flex gap-2 items-center mb-2">
              <FaCalendarDay />
              <p>
                Return: {formatCalendarDate(new Date(booking.trip.endDate))}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <FaUserFriends />
              <div>Passengers: {booking.guestNames.join(", ")}</div>
            </div>
          </CardBody>
        </Card>
      ))}
    </ul>
  );
};
