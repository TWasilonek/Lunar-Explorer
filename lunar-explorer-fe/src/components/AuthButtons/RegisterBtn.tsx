import { paths } from "@/paths";
import { Link } from "@nextui-org/link";

export const RegisterBtn = () => {
  return (
    <Link
      href={paths.auth.register()}
      color="foreground"
      className="transition-colors active:text-primary-500 active:opacity-1 hover:text-primary-500 hover:opacity-1"
    >
      Register
    </Link>
  );
};
