import { Divider } from "@nextui-org/divider";
import { FaSpaceShuttle, FaCalendarDay, FaMapPin } from "react-icons/fa";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { TripsResponse } from "@bookings-server/types";

import "./TripDetails.css";

type Props = {
  trip: TripsResponse;
  direction?: "column" | "row";
};

export const TripDetails = ({ trip, direction = "column" }: Props) => {
  const flexDirection = direction === "column" ? "flex-col" : "flex-row";
  return (
    <div className={`flex ${flexDirection} gap-6 w-full`}>
      <div className="flex-1">
        <h4 className="">Departure</h4>
        <Divider className="my-3" />
        <ul className="text-sm">
          <li className="trip-details-item">
            <FaCalendarDay />{" "}
            {formatDateToDisplay(new Date(trip.flightToMoon.departureTime))}
          </li>
          <li className="trip-details-item">
            <FaMapPin />
            {trip.flightToMoon.originPort.name}
          </li>
          <li className="trip-details-item items-start">
            <FaSpaceShuttle />
            <div>
              <p>{trip.flightToMoon.spaceship.model}</p>
              <p className="text-slate-400">
                {trip.flightToMoon.spaceship.manufacturer.name}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <h4>Return</h4>
        <Divider className="my-3" />
        <ul className="text-sm">
          <li className="trip-details-item">
            <FaCalendarDay />{" "}
            {formatDateToDisplay(new Date(trip.flightToEarth.arrivalTime))}
          </li>
          <li className="trip-details-item">
            <FaMapPin />
            {trip.flightToEarth.originPort.name}
          </li>
          <li className="trip-details-item items-start">
            <FaSpaceShuttle />
            <div>
              <p>{trip.flightToEarth.spaceship.model}</p>
              <p className="text-slate-400">
                {trip.flightToEarth.spaceship.manufacturer.name}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
