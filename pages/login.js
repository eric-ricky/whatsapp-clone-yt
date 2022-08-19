import { Button } from "@material-ui/core";
import { signInWithPopup } from "firebase/auth";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  
  const signIn = async () => {
    try {
      console.log("loging....");
      const result = await signInWithPopup(auth, provider);
      router.push(`/`);

      console.log(result);
      console.log("Logged in successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Log in Page next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginContainer>
        <Button
          onClick={signIn}
          variant="outlined"
          style={{ background: "#db3236" }}
        >
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 5rem;
  > button {
    color: #fff;
  }
`;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background: whitesmoke;
`;
