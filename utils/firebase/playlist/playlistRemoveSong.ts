import { doc, getDoc, updateDoc } from "firebase/firestore";
import { App } from "../cfg/firebaseConfig";
import { getFirestore } from "firebase/firestore";

export default async (playlistId: string, songId: string) => {
  try {
    const db = getFirestore(App);
    const playlistRef = doc(db, "playlists/" + playlistId);
    const res = await getDoc(playlistRef).then((e) => e.data());
    if (res)
      await updateDoc(playlistRef, {
        songs: [...res.songs.filter((e: string) => e !== songId)],
      });
  } catch (error) {
    throw new Error("Error: can't write data");
  }
};
