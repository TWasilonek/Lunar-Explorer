import { PageContainer } from "@/components/PageContainer";
import { RegisterForm } from "@/modules/auth/RegisterForm";
import { paths } from "@/paths";
import { Link } from "@nextui-org/link";

export default async function SignUp() {
  return (
    <PageContainer>
      <div className="mx-auto mt-20 xl:mt-40 mb-20 xl:mb-0 max-w-md flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl">Register</h1>
        <p>You are one step further to achieve your dreams!</p>
        <RegisterForm />
        <div>
          Already have an account?{" "}
          <Link href={paths.auth.login()}>Sign In</Link>
        </div>
      </div>
    </PageContainer>
  );
}
