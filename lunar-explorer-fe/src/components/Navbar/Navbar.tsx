import Link from "next/link";

import { LoginButton } from "../LoginButton";
import { paths } from "@/paths";

const Navbar = () => {
  return (
    <div className="flex justify-between mb-4">
      <nav>
        <Link href={paths.tripsList()}>Trips</Link>
      </nav>
      <LoginButton />
    </div>
  );
};

export default Navbar;
