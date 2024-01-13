"use client";

import { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { paths } from "@/paths";
import { NavUserArea } from "./NavUserArea";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <NextUINavbar
      // onMenuOpenChange={setIsMenuOpen}
      isBordered
      maxWidth="full"
    >
      {/* <NavbarContent> */}
      {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        /> */}
      <NavbarBrand className="flex-grow-0">
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit">Lunar Explorer</p>
      </NavbarBrand>
      {/* </NavbarContent> */}
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

      {/* <NavbarMenu>
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </NextUINavbar>
  );
};

export default Navbar;
