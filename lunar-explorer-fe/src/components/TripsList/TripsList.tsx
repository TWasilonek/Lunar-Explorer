"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { SimpleTripResponse } from "@bookings-server/types";
import { TripListItem } from "./TripListItem";
import { TripDetails } from "./TripDetails";

type Props = {
  trips: SimpleTripResponse[];
};

export const TripsList = ({ trips }: Props) => {
  const pathname = usePathname();
  const queryParams = useSearchParams();

  return (
    <div className="flex justify-between">
      <ul>
        {trips.map((trip) => (
          <TripListItem
            key={trip.id}
            trip={trip}
            pathname={pathname}
            queryParams={queryParams}
          />
        ))}
      </ul>
      {!!queryParams.get("tripId") && (
        <TripDetails tripId={queryParams.get("tripId")!} />
      )}
    </div>
  );
};
