import { LoginForm } from "@/modules/auth";
import { paths } from "@/paths";
import { Link } from "@nextui-org/link";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  return (
    <div className="mx-auto mt-40 max-w-md flex flex-col justify-center items-center gap-4">
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
