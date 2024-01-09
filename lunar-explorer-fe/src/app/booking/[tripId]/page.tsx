type Props = {
  params: {
    tripId: string;
  };
};

export default function BookingPage({ params }: Props) {
  // TODO: call form action to book the trip
  return (
    <div>
      <h1>Book the trip {params.tripId}</h1>
    </div>
  );
}
