import { useRouter } from "next/router";
import { Avatar } from "@material-ui/core";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

const Chat = ({ id, users }) => {
  //   const enterChat = () => {
  //     console.log("routing..");
  //     router.push(`/chat/${id}`);
  //     console.log("routed successfully.");
  //   };
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);

  const recipientRef = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );
  const [recipientSnapshot] = useCollection(recipientRef);

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    console.log("first");
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? <UserAvatar src={recipient?.photoURL} /> : <UserAvatar />}
      <p>{recipientEmail}</p>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
