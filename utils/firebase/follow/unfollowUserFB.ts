import { App } from "../cfg/firebaseConfig";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

export default async (uid: string, followUID: string) => {
  try {
    const db = getFirestore(App);
    const userRef = doc(db, "users/" + uid);
    const user2Ref = doc(db, "users/" + followUID);
    const data = await getDoc(userRef).then((e) => e.data());
    const data2 = await getDoc(user2Ref).then((e) => e.data());
    if (data)
      await updateDoc(userRef, {
        following: data.following.filter((e: string) => e !== followUID),
      });
    if (data2) {
      await updateDoc(user2Ref, {
        followers: data2.following.filter((e: string) => e !== uid),
      });
    }
  } catch (error) {
    throw new Error("Error: can't write data");
  }
};
