import { App } from "../cfg/firebaseConfig";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { MusicI } from "../../../types/MusicI";

export default async () => {
  const db = getFirestore(App);
  try {
    const songs: any[] = [];
    const q = query(collection(db, "songs/"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => songs.push(e.data()));
    const id = Math.round(Math.random() + songs.length - 2);
    const song = songs[id];
    const item: MusicI = {
      author: song.author,
      duration: song.songLength,
      fileURL: song.fileUrl,
      id: song.id,
      imageURL: song.image,
      songName: song.name,
      authorID: song.uid,
    };
    return item;
  } catch (error) {
    throw new Error("Error: can't read data");
  }
};
