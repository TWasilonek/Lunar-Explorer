"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import * as actions from "@/actions";
import { RoomType } from "@bookings-server/types";

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
    <form action={action}>
      <div>
        <label htmlFor="roomType">Select room type</label>
        <select name="roomType" id="roomType">
          <option value={RoomType.SINGLE} selected>
            Single
          </option>
          <option value={RoomType.DOUBLE}>Double</option>
        </select>
      </div>
      <div>
        <label htmlFor="numberOfGuests">Number of guests</label>
        <select
          name="numberOfGuests"
          id="numberOfGuests"
          onChange={handleNumberOfGuestsChange}
        >
          <option value="1" selected>
            1
          </option>
          <option value="2">2</option>
        </select>
      </div>
      <div>
        <label htmlFor="guestName1">Guest 1 name</label>
        <input
          type="text"
          name="guestName1"
          id="guestName1"
          placeholder="Guest name"
        />
      </div>
      {numberOfGuests === 2 && (
        <div>
          <label htmlFor="guestName2">Guest 1 name</label>
          <input
            type="text"
            name="guestName2"
            id="guestName2"
            placeholder="Guest name"
          />
        </div>
      )}

      {formState.errors._form ? (
        <div className="rounded p-2 bg-red-200 border border-red-400">
          {formState.errors._form.join(", ")}
        </div>
      ) : null}

      <button type="submit" aria-disabled={pending}>
        Book
      </button>
    </form>
  );
};
