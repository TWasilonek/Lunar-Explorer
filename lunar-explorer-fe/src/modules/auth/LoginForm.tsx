"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";
import { Button, Chip, Input } from "@nextui-org/react";
import { FormErrorMessage } from "@/components/FormErrorMessage";

const getCallbackUrl = (providedCallBackUrl?: string) => {
  if (!providedCallBackUrl) {
    return paths.home();
  }

  if (
    [paths.auth.login(), paths.auth.register()].includes(providedCallBackUrl)
  ) {
    return paths.tripsList();
  }

  return providedCallBackUrl;
};

type Props = {
  className?: string;
  callbackUrl?: string;
  searchParamsError?: string;
};

// TODO: Should you also pass a csrf token like they say in the documentation?
// https://next-auth.js.org/configuration/pages#credentials-sign-in
export const LoginForm = (props: Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (response?.error && response.error === "CredentialsSignin") {
      setError("Invalid credentials");
    } else {
      router.push(getCallbackUrl());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-5 flex flex-col gap-8">
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {props.searchParamsError ? (
        <FormErrorMessage errorMessage="Invalid credentials" />
      ) : null}
      {error ? <FormErrorMessage errorMessage={error} /> : null}
      <Button type="submit" size="lg" color="primary">
        Sign In
      </Button>
    </form>
  );
};
