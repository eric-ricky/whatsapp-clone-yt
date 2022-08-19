import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
// import { Chat as ChatIcon, MoreVert, SearchOutlined } from "@material-ui/icons";

import * as EmailValidator from "email-validator";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

import Chat from "./Chat";
import { useState } from "react";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  // const useChatRef = query(
  //   collection(db, "chats"),
  //   where("users", "array-contains", user.email)
  // );
  // const [chatsSnapshot] = useCollection(useChatRef);

  // const createChat = async () => {
  //   const input = prompt("Enter email for the user you wish to chat with:");

  //   if (
  //     EmailValidator.validate(input) &&
  //     input !== user.email &&
  //     !chatAlreadyExists(input)
  //   ) {
  //     // add chat to db
  //     const colRef = collection(db, "chats");
  //     const payload = {
  //       users: [user.email, input],
  //     };
  //     await addDoc(colRef, payload);

  //     console.log(`chat created with ${input} `);
  //   }
  // };

  // const chatAlreadyExists = (recipientEmail) =>
  //   !!chatsSnapshot?.docs.find(
  //     (chat) =>
  //       chat.data().users.find((user) => user === recipientEmail)?.length > 0
  //   );

  // chatsSnapshot?.docs.map((doc) => console.log(doc.data().users));

  const userChatRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user?.email)
  );

  const [chatsSnapshot] = useCollection(userChatRef);

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  const createChat = async () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );
    if (!input) return null;

    // Adding chat to 'chats' collection if Input is valid, chat does not exist and recipient is not the same as the logged in user
    if (
      EmailValidator.validate(input) &&
      input !== user.email &&
      !chatAlreadyExists(input)
    ) {
      const colRef = collection(db, "chats");
      const payload = { users: [user.email, input] };
      await addDoc(colRef, payload);
      console.log(`chat btn ${input} and ${user.email}`);
    }
  };

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user?.photoURL}
          onClick={async () => {
            console.log("signing out...");
            router.push(`/login`);
            await signOut(auth);
            console.log("Signed out successfully.");
          }}
        />

        <IconsContainer>
          <IconButton>{/* <ChatIcon /> */}ch</IconButton>
          <IconButton>{/* <MoreVert /> */}mr</IconButton>
        </IconsContainer>
      </Header>

      <Search>
        {/* <SearchOutlined /> */}
        🔎
        <SearchInput placeholder="Search" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* list of chats */}
      {chatsSnapshot?.docs.map((chat, i) => (
        <Chat key={i} users={chat.data().users} id={chat.id} />
      ))}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overlay-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline-width: 0;
  padding-left: 1rem;
  font-size: 1.25rem;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  /* increases the priority of these styles */
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: white;
  /* box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5); */
  z-index: 1;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
