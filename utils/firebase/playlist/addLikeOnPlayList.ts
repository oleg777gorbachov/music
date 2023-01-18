import { App } from "../cfg/firebaseConfig";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

export default async (uid: string, id: string) => {
  try {
    const db = getFirestore(App);
    const userRef = doc(db, "users/" + uid);
    const userData = await getDoc(userRef).then((e) => e.data());
    if (userData) {
      await updateDoc(userRef, {
        playlists: [...userData.playlists, id],
      });
    }
  } catch (error) {
    throw new Error("Error: can't write data");
  }
};
