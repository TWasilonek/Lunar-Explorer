"use client";

import { signOut, useSession } from "next-auth/react";
import { LoginBtn, RegisterBtn } from "../AuthButtons";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Spinner,
} from "@nextui-org/react";
import { UserFromJWT } from "@/types";
import { paths } from "@/paths";

export const NavUserArea = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <Spinner color="default" />;
  }

  if (session.data?.user) {
    const { firstName, lastName, email } = session.data.user as UserFromJWT;
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            name={firstName + " " + lastName}
            size="sm"
            src=""
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="summary" className="h-14 gap-2 cursor-default">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{email}</p>
          </DropdownItem>
          <DropdownItem key="profile">
            <Link href={paths.profile()} color="foreground">
              Edit profile
            </Link>
          </DropdownItem>
          <DropdownItem key="bookings">
            <Link href={paths.myBookings()} color="foreground">
              My bookings
            </Link>
          </DropdownItem>
          <DropdownItem key="signout">
            <Button
              variant="light"
              disableAnimation
              disableRipple
              className="data-[hover=true]:bg-transparent justify-start px-0 h-unit-5 text-medium text-violet-400"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <div className="flex gap-4">
      <RegisterBtn />
      <LoginBtn />
    </div>
  );
};
