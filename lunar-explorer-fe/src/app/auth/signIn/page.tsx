import { PageContainer } from "@/components/PageContainer";
import { LoginForm } from "@/modules/auth";
import { paths } from "@/paths";
import { Link } from "@nextui-org/link";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  return (
    <PageContainer>
      <div className="mx-auto mt-20 xl:mt-40 mb-20 xl:mb-0 max-w-md flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl">Login</h1>
        <LoginForm
          searchParamsError={props.searchParams?.error}
          callbackUrl={props.searchParams?.callbackUrl}
        />
        <div>
          Don&apos;t have an account?{" "}
          <Link href={paths.auth.register()}>Register</Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default SignInPage;
