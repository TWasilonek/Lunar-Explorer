import { RegisterForm } from "@/modules/auth/RegisterForm";
import { paths } from "@/paths";
import Link from "next/link";

export default async function SignUp() {
  return (
    <div>
      <h1>Register</h1>
      <p>You are one step further to achieve your dreams!</p>
      <div>
        <RegisterForm />
      </div>
      <div>
        Already have an account? <Link href={paths.auth.login()}>Sign In</Link>
      </div>
    </div>
  );
}
