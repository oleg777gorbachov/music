import { App } from "../cfg/firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import readUser from "../user/readUser";

export default async (email: string, password: string) => {
  const auth = getAuth(App);
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const optional = await readUser(user.uid);
    return { user, optional };
  } catch (error) {
    throw new Error("Error: can't write user data");
  }
};
