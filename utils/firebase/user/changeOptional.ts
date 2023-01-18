import { App } from "./../cfg/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default async (imageurl: string, name: string, uid: string) => {
  try {
    const db = getFirestore(App);
    const playlistRef = query(
      collection(db, "playlists"),
      where("authorID", "==", uid)
    );
    const songsRef = query(collection(db, "songs"), where("uid", "==", uid));
    const userRef = doc(db, "users/" + uid);
    const playlistQ = await getDocs(playlistRef);
    playlistQ.forEach(async (e) => {
      const data = e.data();
      if (data)
        await updateDoc(doc(db, "playlists/" + e.id), {
          author: name,
        });
    });
    const songsQ = await getDocs(songsRef);
    songsQ.forEach(async (e) => {
      const data = e.data();
      if (data)
        await updateDoc(doc(db, "songs/" + e.id), {
          author: name,
        });
    });
    await updateDoc(userRef, {
      username: name,
      image: imageurl,
    });
  } catch (error) {
    throw new Error("Error: can't write data");
  }
};
