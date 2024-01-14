"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Spinner } from "@nextui-org/react";
import * as actions from "@/actions";
import { FormErrorMessage } from "@/components/FormErrorMessage";

export const RegisterForm = () => {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(actions.registerUser, {
    errors: {},
  });

  return (
    <form action={action} className="w-full p-5 flex flex-col gap-8">
      {pending && <Spinner color="default" label="Verifying credentials..." />}
      <Input
        type="text"
        label="First Name"
        name="firstName"
        required
        isInvalid={!!formState.errors.firstName}
        errorMessage={formState.errors.firstName}
        isDisabled={pending}
      />
      <Input
        type="text"
        label="Last Name"
        name="lastName"
        required
        isInvalid={!!formState.errors.lastName}
        errorMessage={formState.errors.lastName}
        isDisabled={pending}
      />
      <Input
        type="email"
        label="Email"
        name="email"
        required
        isInvalid={!!formState.errors.email}
        errorMessage={formState.errors.email}
        isDisabled={pending}
      />
      <Input
        type="password"
        label="Password"
        name="password"
        required
        isInvalid={!!formState.errors.password}
        errorMessage={formState.errors.password}
        isDisabled={pending}
      />
      <Input
        type="password"
        label="Repeat password"
        name="repeatPassword"
        required
        isInvalid={!!formState.errors.repeatPassword}
        errorMessage={formState.errors.repeatPassword}
        isDisabled={pending}
      />
      {!!formState.errors._form && (
        <FormErrorMessage errorMessage={formState.errors._form.join(", ")} />
      )}
      <Button type="submit" size="lg" color="primary" disabled={pending}>
        Register
      </Button>
    </form>
  );
};
