"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spinner,
} from "@nextui-org/react";
import { SimpleTripResponse } from "@bookings-server/types";
import { TripListItem } from "./TripListItem";
import { TripDetails } from "../TripDetails/";
import { paths } from "@/paths";
import { useGetTrip } from "@/hooks/useGetTrip";
import { checkIfFullyBooked } from "@/utils/bookingUtils";

type Props = {
  trips: SimpleTripResponse[];
};

export const TripsList = ({ trips }: Props) => {
  const pathname = usePathname();
  const queryParams = useSearchParams();
  const tripId = queryParams.get("tripId");
  const { trip, error, loading } = useGetTrip({ tripId });

  const renderTripDetails = () => {
    if (error || !tripId || !trip) return null;
    if (loading) return <Spinner />;

    return (
      <>
        <TripDetails trip={trip} />
        <Divider className="my-3" />
        <div className="flex justify-between items-center mt-2">
          <p>
            <strong>Available spots: </strong>
            {trip.capacity - trip.occupancy}
          </p>

          {!checkIfFullyBooked(trip) && (
            <Button
              href={paths.booking(tripId)}
              as={Link}
              color="primary"
              variant="solid"
            >
              Book now
            </Button>
          )}
        </div>
      </>
    );
  };

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
          <h3 className="text-xl">
            {!!trip ? "Trip details" : "No trip chosen yet"}
            {!!trip && checkIfFullyBooked(trip) && (
              <Chip color="danger" className="ml-3">
                Fully Booked
              </Chip>
            )}
          </h3>
        </CardHeader>
        <CardBody>{!!tripId && renderTripDetails()}</CardBody>
      </Card>
    </div>
  );
};
