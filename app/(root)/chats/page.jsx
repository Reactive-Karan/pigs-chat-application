"use client";
import ChatList from "@components/ChatList";
import Contacts from "@components/Contacts";
import { useSession } from "next-auth/react";
import React from "react";

const Chats = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList />
      </div>
      <div className="w-2/3 max-lg:w:1/2 max-md:hidden">
        <Contacts />
      </div>
    </div>
  );
};

export default Chats;
