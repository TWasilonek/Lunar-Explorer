"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { paths, restApi } from "@/paths";
import { UserFromJWT } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

type UpdateUserFormState = {
  errors: {
    _form?: string[];
  };
};

export async function updateUserProfile(
  formState: UpdateUserFormState,
  formData: FormData
): Promise<UpdateUserFormState> {
  const rawFormData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  };

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }
  const user = session.user as UserFromJWT;

  try {
    const response = await fetch(restApi.user.profile(), {
      method: "PUT",
      headers: {
        authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rawFormData),
    });
    const result = await response.json();
    if (response.ok) {
      return {
        errors: {},
      };
    } else if (result.message) {
      return {
        errors: {
          _form: [result.message],
        },
      };
    } else {
      console.error("Failed to update profile", result);
      return {
        errors: {
          _form: ["Failed to update profile"],
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

  revalidatePath(paths.profile());
  return {
    errors: {},
  };
}
