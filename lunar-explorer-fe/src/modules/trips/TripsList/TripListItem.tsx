import Link from "next/link";
import { formatCalendarDate } from "@/utils/dateUtils";
import { SimpleTripResponse } from "@bookings-server/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";

import "./TripListItem.css";

type Props = {
  trip: SimpleTripResponse;
  pathname: string;
  queryParams: ReadonlyURLSearchParams;
};
export const TripListItem = ({
  trip,
  pathname,
  queryParams: searchParams,
}: Props) => {
  const updatedSearchParams = new URLSearchParams(searchParams);
  updatedSearchParams.set("tripId", trip.id.toString());
  const tripUrl = `${pathname}?${updatedSearchParams.toString()}`;
  const isFullyBooked = trip.occupancy >= trip.capacity;

  return (
    <Card
      key={trip.id}
      as="li"
      classNames={{
        base: "trip-card",
        body: "p-0",
      }}
    >
      <CardBody>
        <Link
          href={tripUrl}
          className={`trip-card_content p-4 flex flex-col gap-2 ${
            isFullyBooked && "trip-card_content--fully-booked"
          }`}
          aria-disabled={isFullyBooked}
        >
          <h4>
            <strong>Launch Date:</strong>{" "}
            {formatCalendarDate(new Date(trip.startDate))}
          </h4>
          <h4>
            <strong>Return Date:</strong>{" "}
            {formatCalendarDate(new Date(trip.endDate))}
          </h4>
          <p>
            <strong>Available spots:</strong>&nbsp;
            {trip.capacity - trip.occupancy}
          </p>
          {isFullyBooked && <div className="text-red-500">Fully booked</div>}
        </Link>
      </CardBody>
    </Card>
  );
};
