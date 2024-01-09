import { BookingForm } from "@/modules/bookings/BookingForm";
import { restApi } from "@/paths";
import { formatDateToDisplay } from "@/utils/dateUtils";

const getTrip = async (tripId: string) => {
  const res = await fetch(restApi.trips.getById(tripId));
  const json = await res.json();
  return json;
};

type Props = {
  params: {
    tripId: string;
  };
};

export default async function BookingPage({ params }: Props) {
  const trip = await getTrip(params.tripId);

  return (
    <div>
      <h1>Book the trip {params.tripId}</h1>
      <div>
        <h4>Departure</h4>
        <ul>
          <li>
            {formatDateToDisplay(new Date(trip.flightToMoon.departureTime))}{" "}
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
      {/* TODO: Pass userId, when user is logged in (this page can only be shown when user is logged in) */}
      <BookingForm tripId={params.tripId} />
    </div>
  );
}
