type Props = {
  params: {
    bookingNumber: string;
  };
};

export default function UserBookingDetailsPage({ params }: Props) {
  // TODO: fetch the user booking details from the API
  return (
    <div>
      <h1>User Booking Details</h1>
      <pre>{params.bookingNumber}</pre>
    </div>
  );
}
