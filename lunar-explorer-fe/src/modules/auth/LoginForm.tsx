"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  callbackUrl?: string;
  searchParamsError?: string;
};

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
      router.push(props.callbackUrl ?? paths.home());
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {props.searchParamsError ? (
          <div className="rounded p-2 bg-red-200 border border-red-400">
            Invalid credentials
          </div>
        ) : null}
        {error ? (
          <div className="rounded p-2 bg-red-200 border border-red-400">
            {error}
          </div>
        ) : null}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
