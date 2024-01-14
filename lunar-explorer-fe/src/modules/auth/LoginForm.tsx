"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";
import { Button, Input, Spinner } from "@nextui-org/react";
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
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (error) {
      setFormErrorMessage(error);
    } else if (props.searchParamsError) {
      setFormErrorMessage(props.searchParamsError);
    }
  }, [props.searchParamsError, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("We are havinbg some problems. Please try again later.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-5 flex flex-col gap-8">
      {isVerifying && (
        <Spinner color="default" label="Verifying credentials..." />
      )}
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        isInvalid={!!formErrorMessage}
        disabled={isVerifying}
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        isInvalid={!!formErrorMessage}
        disabled={isVerifying}
      />
      {!!formErrorMessage && (
        <FormErrorMessage errorMessage={formErrorMessage} />
      )}
      <Button type="submit" size="lg" color="primary" disabled={isVerifying}>
        Sign In
      </Button>
    </form>
  );
};
