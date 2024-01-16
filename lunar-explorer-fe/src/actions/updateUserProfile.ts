"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { paths, restApi } from "@/paths";
import { UserFromJWT } from "@/types";
import { joi } from "@/utils/customJoi";
import { ValidationError } from "joi";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

const updateProfileSchema = joi.object({
  firstName: joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: joi.string().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  // { tlds: false } because of: https://github.com/hapijs/joi/issues/2390#issuecomment-1595763746
  email: joi.string().email({ tlds: false }).required().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

type UpdateUserFormState = {
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
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

  const validationResult = updateProfileSchema.validate(
    {
      ...rawFormData,
    },
    { abortEarly: false }
  );

  if (validationResult.error) {
    if (validationResult.error.details.length > 0) {
      const errors = (validationResult.error as ValidationError).details.reduce(
        (acc, detail) => {
          if (detail.path.length === 1) {
            // @ts-ignore
            acc[detail.path[0]] = detail.message;
          }
          return acc;
        },
        {} as UpdateUserFormState["errors"]
      );
      return { errors };
    } else {
      return {
        errors: {
          _form: ["Failed to update profile"],
        },
      };
    }
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
      revalidatePath(paths.profile());
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
}
