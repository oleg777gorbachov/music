import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { App } from "../cfg/firebaseConfig";
import { getFirestore } from "firebase/firestore";

export default async (name: string, author: string, uid: string) => {
  try {
    const db = getFirestore(App);
    const res = await addDoc(collection(db, "playlists"), {
      name,
      author,
      authorID: uid,
      songs: [],
    });
    await updateDoc(doc(db, "playlists/" + res.id), {
      id: res.id,
    });
    return res.id;
  } catch (error) {
    throw new Error("Error: can't write data");
  }
};
