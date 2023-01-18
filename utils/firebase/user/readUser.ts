import { doc, getFirestore, getDoc } from "firebase/firestore";
import { App } from "../cfg/firebaseConfig";

export default async (uid: string) => {
  const db = getFirestore(App);
  try {
    const userRef = doc(db, "users/" + uid);
    const response = await getDoc(userRef).then((e) => e.data());
    return response;
  } catch (error) {
    throw new Error("Error: can't read user data");
  }
};
