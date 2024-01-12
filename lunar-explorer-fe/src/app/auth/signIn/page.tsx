import { LoginForm } from "@/modules/auth";
import { paths } from "@/paths";
import Link from "next/link";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  return (
    <div>
      <h2>Sign In</h2>
      <LoginForm
        searchParamsError={props.searchParams?.error}
        callbackUrl={props.searchParams?.callbackUrl}
      />
      <div>
        Don&apos;t have an account?{" "}
        <Link href={paths.auth.register()}>Sign Up</Link>
      </div>
    </div>
  );
};

export default SignInPage;
