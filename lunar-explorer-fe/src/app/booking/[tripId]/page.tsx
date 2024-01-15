import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import { Chip } from "@nextui-org/chip";
import { restApi } from "@/paths";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingForm } from "@/modules/bookings/BookingForm";
import { LoginBtn } from "@/components/AuthButtons";
import { PageHeader } from "@/components/PageHeader";
import { TripDetails } from "@/modules/trips/TripDetails";
import { Card, CardBody } from "@nextui-org/card";
import { checkIfFullyBooked } from "@/utils/bookingUtils";

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
  if (!trip) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const isFullyBooked = checkIfFullyBooked(trip);

  return (
    <div className="p-4">
      <PageHeader
        title={
          isFullyBooked ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Book your trip</span>
              <Chip color="danger">Fully Booked</Chip>
            </div>
          ) : (
            "Book your trip"
          )
        }
      />

      <TripDetails trip={trip} direction="row" />
      <div className="mt-8 max-w-xs">
        {session && session.user ? (
          <div>
            <h2 className="text-xl mb-8">Booking details</h2>
            <BookingForm trip={trip} />
          </div>
        ) : (
          <Card className="mx-auto max-w-md">
            <CardBody className="text-center">
              <p>You need to be logged in to book a trip</p>
              <LoginBtn />
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
