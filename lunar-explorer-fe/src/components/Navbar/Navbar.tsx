import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { paths } from "@/paths";
import { NavUserArea } from "./NavUserArea";

const Navbar = () => {
  return (
    <NextUINavbar isBordered maxWidth="full">
      <NavbarBrand className="flex-grow-0">
        <p className="font-bold text-inherit">Lunar Explorer</p>
      </NavbarBrand>
      <NavbarContent className="flex-grow-0 gap-4 ml-4">
        <NavbarItem>
          <Link href={paths.tripsList()} color="foreground">
            Trips
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavUserArea />
      </NavbarContent>
    </NextUINavbar>
  );
};

export default Navbar;
