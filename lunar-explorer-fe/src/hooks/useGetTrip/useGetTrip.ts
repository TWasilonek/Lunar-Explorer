import { restApi } from "@/paths";
import { TripsResponse } from "@bookings-server/types";
import { useEffect, useState } from "react";

export type Params = {
  tripId: string | null | undefined;
};

export const useGetTrip = ({ tripId }: Params) => {
  const [trip, setTrip] = useState<TripsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tripId) return;

    setError(null);
    setLoading(true);

    fetch(restApi.trips.getById(tripId))
      .then((res) => res.json())
      .then((json) => setTrip(json))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [tripId]);

  return { trip, loading, error };
};
