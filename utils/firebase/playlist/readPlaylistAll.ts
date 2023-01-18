import { App } from "../cfg/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default async (playlistids: string[]) => {
  try {
    const db = getFirestore(App);
    const playlists: any[] = [];
    for (let key of playlistids) {
      const playlistRef = doc(db, "playlists/" + key);
      const playlist = await getDoc(playlistRef).then((e) => e.data());
      if (playlist) playlists.push(playlist);
    }

    return playlists;
  } catch (error) {
    throw new Error("Error: can't read data");
  }
};
