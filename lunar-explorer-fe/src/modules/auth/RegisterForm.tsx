"use client";

import { useFormState, useFormStatus } from "react-dom";
import * as actions from "@/actions";

export const RegisterForm = () => {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(actions.registerUser, {
    errors: {},
  });

  return (
    <form action={action}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" required />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>
      <div>
        <label htmlFor="repeatPassword">Repeat password</label>
        <input
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          required
        />
      </div>
      {formState.errors._form ? (
        <div className="rounded p-2 bg-red-200 border border-red-400">
          {formState.errors._form.join(", ")}
        </div>
      ) : null}
      <button type="submit" disabled={pending}>
        Register
      </button>
    </form>
  );
};
