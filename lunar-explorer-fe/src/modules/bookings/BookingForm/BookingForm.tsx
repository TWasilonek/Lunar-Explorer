"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import * as actions from "@/actions";
import { CreateBookingTripSegment, RoomType } from "@bookings-server/types";
import { FormErrorMessage } from "@/components/FormErrorMessage";

type Props = {
  trip: CreateBookingTripSegment;
};

export const BookingForm = ({ trip }: Props) => {
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(
    actions.createBooking.bind(null, trip.id.toString()),
    {
      errors: {},
    }
  );
  const isFullyBooked = trip.occupancy >= trip.capacity;
  const fieldIsDisabled = isFullyBooked || pending;

  const handleNumberOfGuestsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNumberOfGuests(parseInt(event.target.value));
  };

  return (
    <form action={action} className="flex flex-col gap-8">
      {pending && (
        <Spinner color="default" label="Booking your trip to the moon..." />
      )}
      <Select
        name="roomType"
        label="Select room type"
        defaultSelectedKeys={[RoomType.SINGLE]}
        isDisabled={fieldIsDisabled}
      >
        <SelectItem key={RoomType.SINGLE} value={RoomType.SINGLE}>
          Single
        </SelectItem>
        <SelectItem key={RoomType.DOUBLE} value={RoomType.DOUBLE}>
          Double
        </SelectItem>
      </Select>

      <Select
        name="numberOfGuests"
        label="Number of guests"
        onChange={handleNumberOfGuestsChange}
        defaultSelectedKeys={["1"]}
        isDisabled={fieldIsDisabled}
      >
        <SelectItem key={"1"} value={"1"}>
          1
        </SelectItem>
        <SelectItem key={"2"} value={"2"}>
          2
        </SelectItem>
      </Select>

      <Input
        type="text"
        label="Firt guest name"
        name="guestName1"
        required
        isDisabled={fieldIsDisabled}
      />
      {numberOfGuests === 2 && (
        <Input
          type="text"
          label="Second guest name"
          name="guestName2"
          required
          isDisabled={fieldIsDisabled}
        />
      )}

      {!!formState.errors._form && (
        <FormErrorMessage errorMessage={formState.errors._form.join(", ")} />
      )}

      {!isFullyBooked && (
        <Button type="submit" size="lg" color="primary" disabled={pending}>
          Book
        </Button>
      )}
    </form>
  );
};
