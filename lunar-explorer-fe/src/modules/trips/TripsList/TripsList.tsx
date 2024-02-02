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
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-2">
          <p className="text-xl md:text-base">
            <strong>Available spots: </strong>
            {trip.capacity - trip.occupancy}
          </p>

          {!checkIfFullyBooked(trip) && (
            <Button
              href={paths.booking(tripId)}
              as={Link}
              color="primary"
              variant="solid"
              className="mt-4 md:mt-0 w-full md:w-auto text-2xl md:text-base p-6 md:p-3"
            >
              Book now
            </Button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex justify-between flex-col-reverse md:flex-row">
      <ul className="flex-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripListItem
            key={trip.id}
            trip={trip}
            pathname={pathname}
            queryParams={queryParams}
          />
        ))}
      </ul>
      <Card className="flex-1 md:ml-8 mb-8 md:mb-0">
        <CardHeader>
          <h3 className="text-xl">
            {!!trip ? "Trip details" : "No trips available for these dates"}
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
