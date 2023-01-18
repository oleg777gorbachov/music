import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { App } from "../cfg/firebaseConfig";

export default async (songId: string, userId: string) => {
  const db = getFirestore(App);
  try {
    const userRef = doc(db, "users/" + userId);
    await updateDoc(userRef, {
      lastSong: songId,
    });
    const res = await getDoc(userRef).then((e) => e.data());
    if (res) {
      if (res.songHistory) {
        const songs = res.songHistory.filter((e: string) => e !== songId);
        await updateDoc(userRef, {
          songHistory: [...songs, songId],
        });
      } else {
        await updateDoc(userRef, {
          songHistory: [songId],
        });
      }
    }
  } catch (error) {
    throw new Error("Error: can't update state");
  }
};
