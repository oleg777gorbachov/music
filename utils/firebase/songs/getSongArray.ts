import { songFBI } from "./../../../types/SongFBI";
import { MusicI } from "./../../../types/MusicI";
import { collection, query, getDocs, getFirestore } from "firebase/firestore";
import { App } from "../cfg/firebaseConfig";

export default async () => {
  const db = getFirestore(App);

  try {
    let songs: any[] = [];
    const selectedSong: any[] = [];
    const q = query(collection(db, "songs/"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      songs.push(e.data());
    });
    songs = songs.map((e: songFBI): MusicI => {
      return {
        id: e.id,
        fileURL: e.fileUrl,
        imageURL: e.image,
        songName: e.name,
        author: e.author,
        duration: e.songLength,
        authorID: e.uid,
      };
    });

    const id = Math.round(Math.random() + songs.length - 2);
    selectedSong.push(songs[id]);
    songs.filter((e, index) => index !== id);

    return { songs, selectedSong: selectedSong[0] };
  } catch (error) {
    throw new Error("Error: can't read server data");
  }
};
