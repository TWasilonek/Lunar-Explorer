import { paths, restApi } from "@/paths";
import { joi } from "@/utils/customJoi";
import { ValidationError } from "joi";
import { redirect } from "next/navigation";

export const signupSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  // { tlds: false } because of: https://github.com/hapijs/joi/issues/2390#issuecomment-1595763746
  email: joi.string().email({ tlds: false }).required(),
  password: joi.string().min(8).required(),
  repeatPassword: joi.string().valid(joi.ref("password")).required(),
});

type RegisterUserFormState = {
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
    _form?: string[];
  };
};

export async function registerUser(
  formState: RegisterUserFormState,
  formData: FormData
): Promise<RegisterUserFormState> {
  const rawFormData = Object.fromEntries(formData.entries());

  const validationResult = signupSchema.validate(
    {
      ...rawFormData,
    },
    { abortEarly: false }
  );

  if (validationResult.error) {
    return {
      errors: {
        _form: (validationResult.error as ValidationError).details.map(
          (detail) => detail.message
        ),
      },
    };
  }

  const body = {
    firstName: rawFormData.firstName,
    lastName: rawFormData.lastName,
    email: rawFormData.email,
    password: rawFormData.password,
  };

  try {
    const response = await fetch(restApi.auth.signup(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
      if (result.message) {
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

  redirect(paths.auth.login());
}
