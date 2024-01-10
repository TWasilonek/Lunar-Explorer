"use server";

import { getServerSession } from "next-auth/next";
import { paths, restApi } from "@/paths";
import {
  CreateBookingBody,
  CreateBookingResponse,
  RoomType,
} from "@bookings-server/types";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserFromJWT } from "@/types";
import { joi } from "@/utils/customJoi";
import { ValidationError } from "joi";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createBookingFormSchema = joi.object({
  roomType: joi.any().valid(RoomType.SINGLE, RoomType.DOUBLE).required(),
  numberOfGuests: joi.number().min(1).max(2).required(),
  guestNames: joi
    .array()
    .items(joi.string())
    .length(joi.ref("numberOfGuests"))
    .message("guestNames length must be equal to numberOfGuests")
    .required(),
});

type CreateBookingFormState = {
  errors: {
    roomType?: RoomType;
    numberOfGuests?: number;
    guestName1?: string;
    guestName2?: string;
    _form?: string[];
  };
};

export async function createBooking(
  tripId: string,
  formState: CreateBookingFormState,
  formData: FormData
): Promise<CreateBookingFormState> {
  const tripIdNumber = parseInt(tripId, 10);
  const roomType = formData.get("roomType") as RoomType;
  const numberOfGuests = parseInt(formData.get("numberOfGuests") as string, 10);
  const guestNames = formData.get("guestName2")
    ? [
        formData.get("guestName1") as string,
        formData.get("guestName2") as string,
      ]
    : [formData.get("guestName1") as string];

  if (isNaN(numberOfGuests)) {
    return {
      errors: {
        _form: ["Number of guests must be a number"],
      },
    };
  }

  if (isNaN(tripIdNumber)) {
    return {
      errors: {
        _form: ["Invalid trip"],
      },
    };
  }

  const validationResult = createBookingFormSchema.validate({
    roomType,
    numberOfGuests,
    guestNames,
  });

  if (validationResult.error) {
    return {
      errors: {
        _form: (validationResult.error as ValidationError).details.map(
          (detail) => detail.message
        ),
      },
    };
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }
  const user = session.user as UserFromJWT;
  const body: CreateBookingBody = {
    userId: user.id,
    tripId: tripIdNumber,
    roomType,
    numberOfGuests,
    guestNames,
  };

  let booking: CreateBookingResponse;
  try {
    const response = await fetch(restApi.bookings.create(), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json", // This MUST be included!
      },
    });
    const result = await response.json();
    if (response.ok) {
      booking = result;
    } else if (result.message) {
      return {
        errors: {
          _form: [result.message],
        },
      };
    } else {
      console.error("Failed to create booking", result);
      return {
        errors: {
          _form: ["Failed to create booking"],
        },
      };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Failed to create booking"],
        },
      };
    }
  }

  revalidatePath(paths.tripsList());
  redirect(paths.myBookingsDetail(booking.bookingNumber));
}
