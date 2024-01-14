"use client";

import { useEffect, useState } from "react";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { TripsResponse } from "@bookings-server/types";
import { paths, restApi } from "@/paths";
import Link from "next/link";
import { Spinner } from "@nextui-org/react";

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
        <h4>Departure</h4>
        <ul>
          <li>
            <strong></strong>
            {formatDateToDisplay(
              new Date(trip.flightToMoon.departureTime)
            )}{" "}
            from {trip.flightToMoon.originPort.name}
          </li>
          <li>
            <strong>You will be flying on </strong>
            {trip.flightToMoon.spaceship.model} by{" "}
            {trip.flightToMoon.spaceship.manufacturer.name}
          </li>
        </ul>
      </div>
      <div>
        <h4>Return</h4>
        <ul>
          <li>
            {formatDateToDisplay(new Date(trip.flightToEarth.arrivalTime))} from{" "}
            {trip.flightToEarth.originPort.name}
          </li>
          <li>
            <strong>You will be flying on </strong>
            {trip.flightToEarth.spaceship.model} by{" "}
            {trip.flightToEarth.spaceship.manufacturer.name}
          </li>
        </ul>
      </div>
      <div>
        <strong>Available spots: </strong>
        {trip.capacity - trip.occupancy}
      </div>

      <Link href={paths.booking(tripId)}>Book now</Link>
    </div>
  );
};
