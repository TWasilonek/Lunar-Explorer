"use server";

import { restApi } from "@/paths";
import { CreateBookingBody, RoomType } from "@bookings-server/types";

export async function createBooking(
  usreId: string,
  tripId: string,
  formData: FormData
) {
  // TODO: validate form data
  const body: CreateBookingBody = {
    userId: formData.get("userId") as string,
    tripId: formData.get("tripId") as string,
    roomType: formData.get("roomType") as RoomType,
    numberOfGuests: parseInt(formData.get("numberOfGuests") as string),
    guestNames: (formData.get("guestNames") as string).split(","),
  };

  console.log("body", body);

  //   return fetch(restApi.bookings.create(), {
  //     method: "POST",
  //     body: formData,
  //   }).then(function (response) {
  //     return response.json();
  //   });
}
