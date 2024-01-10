"use client";

import { useState } from "react";
import * as actions from "@/actions";
import { RoomType } from "@bookings-server/types";

type Props = {
  userId: string;
  tripId: string;
};

export const BookingForm = ({ userId, tripId }: Props) => {
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const handleNumberOfGuestsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNumberOfGuests(parseInt(event.target.value));
  };

  const createBookingWithData = actions.createBooking.bind(
    null,
    userId,
    tripId
  );

  return (
    <form action={createBookingWithData}>
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
        <label htmlFor="numbeOfGuests">Number of guests</label>
        <select
          name="numbeOfGuests"
          id="numbeOfGuests"
          onChange={handleNumberOfGuestsChange}
        >
          <option value="1" selected>
            1
          </option>
          <option value="2">2</option>
        </select>
      </div>
      <div>
        <label htmlFor="guestNames">Guest 1 name</label>
        <input
          type="text"
          name="guestNames"
          id="guestNames"
          placeholder="Guest name"
        />
      </div>
      {numberOfGuests === 2 && (
        <div>
          <label htmlFor="guestNames">Guest 1 name</label>
          <input
            type="text"
            name="guestNames"
            id="guestNames"
            placeholder="Guest name"
          />
        </div>
      )}

      <button type="submit">Book</button>
    </form>
  );
};
