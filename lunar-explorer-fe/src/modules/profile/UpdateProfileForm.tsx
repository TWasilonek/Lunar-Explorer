"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button, Input, Spinner } from "@nextui-org/react";
import { UserProfile } from "@bookings-server/types";

import * as actions from "@/actions";
import { FormErrorMessage } from "@/components/FormErrorMessage";

type Props = {
  profile: UserProfile;
};

export const UpdateUserProfileForm = ({ profile }: Props) => {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(actions.updateUserProfile, {
    errors: {},
  });

  return (
    <form action={action} className="w-full p-5 flex flex-col gap-8">
      {pending && <Spinner color="default" label="Updating..." />}
      <Input
        type="text"
        label="First Name"
        name="firstName"
        defaultValue={profile.firstName}
        required
        isInvalid={!!formState.errors.firstName}
        errorMessage={formState.errors.firstName}
        isDisabled={pending}
      />
      <Input
        type="text"
        label="Last Name"
        name="lastName"
        defaultValue={profile.lastName}
        required
        isInvalid={!!formState.errors.lastName}
        errorMessage={formState.errors.lastName}
        isDisabled={pending}
      />
      <Input
        type="email"
        label="Email"
        name="email"
        defaultValue={profile.email}
        required
        isInvalid={!!formState.errors.email}
        errorMessage={formState.errors.email}
        isDisabled={pending}
      />
      {!!formState.errors._form && (
        <FormErrorMessage errorMessage={formState.errors._form.join(", ")} />
      )}
      <Button type="submit" size="lg" color="primary" disabled={pending}>
        Update Profile
      </Button>
    </form>
  );
};
