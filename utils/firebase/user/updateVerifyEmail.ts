import { doc, updateDoc } from "firebase/firestore";
import { App } from "./../cfg/firebaseConfig";
import { getFirestore } from "firebase/firestore";
export default async (uid: string) => {
  try {
    const db = getFirestore(App);
    const userRef = doc(db, "users/" + uid);
    await updateDoc(userRef, { isVerified: true });
  } catch (error) {
    throw new Error("Error: can't write data");
  }
};
