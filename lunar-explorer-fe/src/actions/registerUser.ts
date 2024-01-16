import { paths, restApi } from "@/paths";
import { joi } from "@/utils/customJoi";
import { ValidationError } from "joi";
import { redirect } from "next/navigation";

export const signupSchema = joi.object({
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
  password: joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  repeatPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "string.empty": "Repeat password is required",
    "any.required": "Repeat password is required",
  }),
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
    if (validationResult.error.details.length > 0) {
      const errors = (validationResult.error as ValidationError).details.reduce(
        (acc, detail) => {
          if (detail.path.length === 1) {
            // @ts-ignore
            acc[detail.path[0]] = detail.message;
          }
          return acc;
        },
        {} as RegisterUserFormState["errors"]
      );
      return { errors };
    }
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
