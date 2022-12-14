import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      (async () => {
        const docRef = doc(db, "users", user.uid);
        const payload = {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        };
        await setDoc(docRef, payload, { merge: true });
      })();
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  console.log(`logged in as ${user?.displayName}`);

  return <Component {...pageProps} />;
}

export default MyApp;
