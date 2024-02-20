"use client";

import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: session } = useSession();

  const currentUser = session?.user;

  const getContacts = async () => {
    try {
      const res = await fetch(
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
      );
      const data = await res.json();

      setContacts(data.filter((contact) => contact._id !== currentUser._id));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  // Select Contacts
  const [selectedContacts, setSelectedContacts] = useState([]);
  const isGroup = selectedContacts.length > 1;

  const handleSelect = (contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContact) =>
        prevSelectedContact.filter((item) => item !== contact)
      );
    } else {
      setSelectedContacts((prevSelectedContact) => [
        ...prevSelectedContact,
        contact,
      ]);
    }
  };

  //   Group Chat Name
  const [name, setName] = useState("");

  //   Create Chat

  const createChat = async () => {
    let body = {
      currentUserId: currentUser._id,
      members: selectedContacts.map((contact) => contact._id),
      isGroup,
      name,
    };

    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const chat = await res.json();

    if (res.ok) {
      router.push(`/chats/${chat._id}`);
    }
  };

  if (loading) return <Loader />;
  return (
    <div className="create-chat-container">
      <input
        placeholder="Search contact"
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="contact"
              onClick={() => handleSelect(contact)}
            >
              {selectedContacts.find((item) => item === contact) ? (
                <CheckCircle sx={{ color: "red" }} />
              ) : (
                <RadioButtonUnchecked />
              )}

              <img
                src={contact?.profileImage || "assets/person.jpg"}
                alt="profile"
                className="profilePhoto"
              />
              <p className="text-base-bold">{contact?.username}</p>
            </div>
          ))}
        </div>

        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group Chat Name</p>
                <input
                  placeholder="Enter group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button className="btn" onClick={createChat}>
            FIND OR START A NEW CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
