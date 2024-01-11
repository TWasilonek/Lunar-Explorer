"use client";

import { useFormState, useFormStatus } from "react-dom";
import { UserProfile } from "@bookings-server/types";

import * as actions from "@/actions";

type Props = {
  profile: UserProfile;
};

export const UpdateUserProfileForm = ({ profile }: Props) => {
  const { pending } = useFormStatus();
  const [formState, action] = useFormState(actions.updateUserProfile, {
    errors: {},
  });

  return (
    <form action={action}>
      <div>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          defaultValue={profile.firstName}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          defaultValue={profile.lastName}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={profile.email}
          required
        />
      </div>

      {formState.errors._form ? (
        <div className="rounded p-2 bg-red-200 border border-red-400">
          {formState.errors._form.join(", ")}
        </div>
      ) : null}

      <button type="submit" aria-disabled={pending}>
        Update Profile
      </button>
    </form>
  );
};
