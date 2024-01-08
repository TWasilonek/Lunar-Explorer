import Link from "next/link";

// TODO: fix the Trip type -> should I have the types in a top-level file in the monorepo?
type Trip = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

async function getTrips(): Promise<Trip[]> {
  const res = await fetch("http://localhost:8000/api/v1/trips");
  const json = await res.json();
  return json;
}

export default async function TripsPage() {
  // TODO: read query params to get the startDate and endDate
  const trips = await getTrips();
  return (
    <div>
      <h1>Trips</h1>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link href={`/trips/${trip.id}`}>{trip.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
