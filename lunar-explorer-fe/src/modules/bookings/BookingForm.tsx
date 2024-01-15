"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import * as actions from "@/actions";
import { RoomType } from "@bookings-server/types";
import { FormErrorMessage } from "@/components/FormErrorMessage";

type Props = {
  tripId: string;
};

export const BookingForm = ({ tripId }: Props) => {
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(
    actions.createBooking.bind(null, tripId),
    {
      errors: {},
    }
  );

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
        isDisabled={pending}
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
        isDisabled={pending}
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
        // isInvalid={!!formState.errors.lastName}
        // errorMessage={formState.errors.lastName}
        isDisabled={pending}
      />
      {numberOfGuests === 2 && (
        <Input
          type="text"
          label="Second guest name"
          name="guestName2"
          required
          // isInvalid={!!formState.errors.lastName}
          // errorMessage={formState.errors.lastName}
          isDisabled={pending}
        />
      )}

      {!!formState.errors._form && (
        <FormErrorMessage errorMessage={formState.errors._form.join(", ")} />
      )}

      <button type="submit" aria-disabled={pending}>
        Book
      </button>
    </form>
  );
};
