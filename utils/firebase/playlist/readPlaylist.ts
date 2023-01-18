import { MusicI } from "../../../types/MusicI";
import { App } from "../cfg/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import readSong from "../songs/readSong";

export default async (playlistid: string) => {
  try {
    const db = getFirestore(App);
    const playlistRef = doc(db, "playlists/" + playlistid);
    const playlist = await getDoc(playlistRef).then((e) => e.data());
    const songs: MusicI[] = [];
    if (playlist === undefined) throw new Error("Error: can't read data");
    for (let key of playlist.songs) {
      const song = await readSong(key);
      if (song) songs.push(song);
    }
    return { playlist, songs };
  } catch (error) {
    throw new Error("Error: can't read data");
  }
};
