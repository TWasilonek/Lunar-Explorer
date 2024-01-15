"use client";

import { useEffect, useState } from "react";
import { Divider, Spinner, Link, Button } from "@nextui-org/react";
import { FaSpaceShuttle, FaCalendarDay, FaMapPin } from "react-icons/fa";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { TripsResponse } from "@bookings-server/types";
import { paths, restApi } from "@/paths";

import "./TripDetails.css";

type Props = {
  tripId: string;
};

export const TripDetails = ({ tripId }: Props) => {
  const [trip, setTrip] = useState<TripsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);
    fetch(restApi.trips.getById(tripId))
      .then((res) => res.json())
      .then((json) => setTrip(json))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return <Spinner />;
  if (error || !trip) return null;

  return (
    <div>
      <div>
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
      <div className="mt-3">
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
      <Divider className="my-3" />
      <div className="flex justify-between items-center mt-4">
        <p>
          <strong>Available spots: </strong>
          {trip.capacity - trip.occupancy}
        </p>

        <Button
          href={paths.booking(tripId)}
          as={Link}
          color="primary"
          variant="solid"
        >
          Book now
        </Button>
      </div>
    </div>
  );
};
