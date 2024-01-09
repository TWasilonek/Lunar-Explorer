"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { TripsResponse } from "@bookings-server/types";
import { useQueryParams } from "@/hooks/useQueryParams";
import { restApi } from "@/paths";

type Props = {
  tripId: string;
};

export const TripDetails = ({ tripId }: Props) => {
  const router = useRouter();
  const { removeQueryParamFromUrl } = useQueryParams();

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!trip) return null;

  const handleClose = () => {
    const newUrl = removeQueryParamFromUrl("tripId");
    router.push(newUrl);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h3>Trip Details</h3>
        <button onClick={handleClose}>X</button>
      </div>

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

      <form>
        <button>Book now</button>
      </form>
    </div>
  );
};
