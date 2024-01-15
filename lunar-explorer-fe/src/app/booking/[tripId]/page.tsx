import { getServerSession } from "next-auth/next";
import { Chip } from "@nextui-org/chip";
import { notFound } from "next/navigation";
import { restApi } from "@/paths";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BookingForm } from "@/modules/bookings";
import { LoginBtn } from "@/components/AuthButtons";
import { PageHeader } from "@/components/PageHeader";
import { TripDetails } from "@/modules/trips/TripDetails";
import { Card, CardBody } from "@nextui-org/card";

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

  return (
    <div className="p-4">
      <PageHeader title="Book your trip" />
      <TripDetails trip={trip} direction="row" />
      <div className="mt-8 max-w-xs">
        {session && session.user ? (
          <div>
            <h2 className="text-xl mb-8">Booking details</h2>
            <BookingForm tripId={params.tripId} />
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
