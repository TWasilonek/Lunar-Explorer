import { formatCalendarDateWithTime } from "@/utils/dateUtils";
import { CreateBookingFlightSegment } from "@bookings-server/types";
import { FaCalendarDay, FaMapPin, FaSpaceShuttle, FaTag } from "react-icons/fa";

import "./BookedFlightDetails.css";

type Props = {
  flight: CreateBookingFlightSegment;
};

export const BookedFlightDetails = ({ flight }: Props) => {
  const renderSeats = (seats: string[]) => {
    return seats.map((seat, idx) => (
      <span key={seat}>
        {" "}
        &quot;{seat}&quot;{idx != seats.length - 1 && ","}
      </span>
    ));
  };

  return (
    <ul className="flex flex-col gap-2">
      <li className="flight-details-item">
        <FaCalendarDay />
        <strong>Departure time:</strong>{" "}
        {formatCalendarDateWithTime(new Date(flight.departureTime))}
      </li>
      <li className="flight-details-item">
        <FaMapPin />
        <strong>Origin port:</strong> {flight.originPort.name}
      </li>
      <li className="flight-details-item">
        <FaSpaceShuttle />
        <strong>Spaceship:</strong> {flight.spaceship.model} by{" "}
        <span className="text-slate-400">
          {flight.spaceship.manufacturer.name}
        </span>
      </li>
      <li className="flight-details-item">
        <FaCalendarDay />
        <strong>Arrival time:</strong>{" "}
        {formatCalendarDateWithTime(new Date(flight.arrivalTime))}
      </li>
      <li className="flight-details-item">
        <FaTag />
        <strong>Seats:</strong>
        {renderSeats(flight.seats)}
      </li>
    </ul>
  );
};
