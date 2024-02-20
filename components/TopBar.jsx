"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";

const TopBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <div className="topbar">
      <Link href="/chats">
        <img src="/assets/logo.png" alt="logo" className="logo" />
      </Link>

      <div className="menu">
        <Link
          href="/chats"
          className={`${pathname === "/chats" && "text-red-1"}`}
        >
          Chats
        </Link>
        <Link
          href="/contacts"
          className={`${pathname === "/contacts" && "text-red-1"}`}
        >
          Contacts
        </Link>

        <Logout
          sx={{ color: "#737373", cursor: "pointer" }}
          onClick={handleLogout}
        />

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
