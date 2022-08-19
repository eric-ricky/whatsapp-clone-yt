import Head from "next/head";
import {
  getDoc,
  doc,
  collection,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../firebase";

import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useRouter } from "next/router";

const ChatPage = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>

      <Sidebar />
      <ChatContainer>
        {/* <ChatScreen messages={messages} chat={chat} /> */}
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
};

export default ChatPage;

export async function getServerSideProps(context) {
  console.log("geting server side...");
  const id = context.query.id;
  const chatRef = doc(db, "chats", id);

  // Prepare the messages..
  const q = query(collection(chatRef, "messages"), orderBy("timestamp", "asc"));
  const docSnap = await getDocs(q);

  const messages = docSnap?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate().getTime(),
  }));

  console.log(messages);

  // Prepare chats...
  const chatSnap = await getDoc(chatRef);
  const chat = {
    id: chatSnap.id,
    ...chatSnap.data(),
  };

  return {
    props: {
      messages,
      chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
  height: 100vh;
  position: relative;
`;
