import { doc, getFirestore, getDoc } from "firebase/firestore";
import { MusicI } from "../../../types/MusicI";
import { App } from "../cfg/firebaseConfig";
export default async (id: string) => {
  const db = getFirestore(App);

  try {
    const songRef = doc(db, "songs/" + id);
    const response = await getDoc(songRef).then((e) => e.data());
    if (response) {
      const result: MusicI = {
        author: response.author,
        duration: response.songLength,
        fileURL: response.fileUrl,
        id: response.id,
        imageURL: response.image,
        songName: response.name,
        authorID: response.uid,
      };
      return result;
    }
  } catch (error) {
    throw new Error("Error: can't read song data");
  }
};
