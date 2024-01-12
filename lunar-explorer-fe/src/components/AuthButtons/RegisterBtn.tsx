import { paths } from "@/paths";
import Link from "next/link";

export const RegisterBtn = () => {
  return <Link href={paths.auth.register()}>Register</Link>;
};
