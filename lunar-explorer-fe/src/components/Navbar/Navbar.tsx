import Link from "next/link";

import { paths } from "@/paths";
import { NavUserArea } from "./NavUserArea";

const Navbar = () => {
  return (
    <div className="flex justify-between mb-4">
      <nav>
        <Link href={paths.tripsList()}>Trips</Link>
      </nav>
      <NavUserArea />
    </div>
  );
};

export default Navbar;
