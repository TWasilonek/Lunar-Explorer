"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { SimpleTripResponse } from "@bookings-server/types";
import { TripListItem } from "./TripListItem";
import { TripDetails } from "./TripDetails";
import { useQueryParams } from "@/hooks/useQueryParams";

type Props = {
  trips: SimpleTripResponse[];
};

export const TripsList = ({ trips }: Props) => {
  const pathname = usePathname();
  const queryParams = useSearchParams();
  // const router = useRouter();
  // const { removeQueryParamFromUrl } = useQueryParams();

  // const handleClose = () => {
  //   const newUrl = removeQueryParamFromUrl("tripId");
  //   router.push(newUrl);
  // };

  const tripId = queryParams.get("tripId");

  return (
    <div className="flex justify-between">
      <ul className="flex-3 grid grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripListItem
            key={trip.id}
            trip={trip}
            pathname={pathname}
            queryParams={queryParams}
          />
        ))}
      </ul>
      <Card className="flex-1 ml-8">
        <CardHeader>
          <h3>{!!tripId ? "Trip details" : "No trip chosen yet"}</h3>
        </CardHeader>
        <CardBody>{!!tripId && <TripDetails tripId={tripId} />}</CardBody>
      </Card>
    </div>
  );
};
