import Link from "next/link";
import { formatDateToDisplay } from "@/utils/dateUtils";
import { SimpleTripResponse } from "@bookings-server/types";
import { ReadonlyURLSearchParams } from "next/navigation";

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

  return (
    <li key={trip.id}>
      <Link href={tripUrl}>
        {formatDateToDisplay(new Date(trip.startDate))} -{" "}
        {formatDateToDisplay(new Date(trip.endDate))}
      </Link>
      <p>
        <strong>Available spots:</strong>&nbsp;
        {trip.capacity - trip.occupancy}
      </p>
    </li>
  );
};
