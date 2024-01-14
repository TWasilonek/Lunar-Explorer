import { redirect } from "next/navigation";
import { SimpleTripResponse } from "@bookings-server/types";
import { TripsList } from "@/modules/trips/TripsList";
import { restApi } from "@/paths";

const validateQueryParams = ({ startDate, endDate }: SearchTripsParams) => {
  if (startDate && !Date.parse(startDate)) return false;
  if (endDate && !Date.parse(endDate)) return false;
  return true;
};

type SearchTripsParams = {
  startDate?: string;
  endDate?: string;
};

async function getTrips(
  searchParams: SearchTripsParams
): Promise<SimpleTripResponse[]> {
  let query = "";

  if (searchParams.startDate && searchParams.endDate) {
    if (validateQueryParams(searchParams)) {
      query = `?startDate=${searchParams.startDate}&endDate=${searchParams.endDate}`;
    } else {
      redirect("/trips");
    }
  }

  const res = await fetch(restApi.trips.list(query));
  const json = await res.json();
  return json;
}

type Props = {
  searchParams: SearchTripsParams;
};

export default async function TripsPage(
  { searchParams }: Props = {
    searchParams: {
      startDate: "",
      endDate: "",
    },
  }
) {
  const trips = await getTrips(searchParams);
  return (
    <div className="p-4">
      <header className="mb-8">
        <h1 className="text-3xl">Choose your trip</h1>
      </header>

      <TripsList trips={trips} />
    </div>
  );
}
