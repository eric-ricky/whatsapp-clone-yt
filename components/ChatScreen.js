import { Avatar, IconButton } from "@material-ui/core";
// import { AttachFile, Mic, MoreVert, InsertEmoticon } from "@material-ui/icons";
import {
  addDoc,
  collection,
  doc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";

import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessageRef = useRef();

  const recipientEmail = getRecipientEmail(chat.users, user);

  console.log(messages);

  const chatRef = doc(db, "chats", chat.id);
  const [messagesSnapshot] = useCollection(
    query(collection(chatRef, "messages"), orderBy("timestamp", "asc"))
  );

  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );

  const showMessages = () => {
    if (!messagesSnapshot?.docs.length > 0)
      return (
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            height: "70vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          No chats yet. Start chatting..
        </p>
      );

    if (messagesSnapshot) {
      console.log("from client..");
      return messagesSnapshot?.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      console.log("from server..");

      return messages?.map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input) {
      console.log("please fill in the field!!!");
      return;
    }
    console.log("sending...");

    // updating last seen
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    // add message
    const colRef = collection(doc(db, "chats", chat.id), "messages");
    await addDoc(colRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    console.log("message sent successfully!");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        {recipient ? <Avatar src={recipient?.photoURL} /> : <Avatar />}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active..</p>
          )}
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>{/* <AttachFile /> */}2</IconButton>
          <IconButton>{/* <MoreVert /> */}1</IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer onSubmit={sendMessage}>
        {/* <InsertEmoticon /> */}🖊
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" hidden />
        {/* <Mic /> */}🎤
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  border-radius: 10px;
  background: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-ndex:10
  padding: 10px;
  background:white;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  < h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div``;
