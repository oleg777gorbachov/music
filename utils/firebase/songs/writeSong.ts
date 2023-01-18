import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { App } from "../cfg/firebaseConfig";
import readSongFile from "./readSongFile";

export default async (
  file: Blob,
  songPreview: Blob,
  name: string,
  author: string,
  uid: string,
  songLength: number
) => {
  const storage = getStorage();
  const db = getFirestore(App);
  try {
    const id = doc(collection(db, "songs")).id;
    const songRef = doc(db, "songs/" + id);

    const imagePath = "songs/" + id + "/avatar/avatar";
    const imageRef = ref(storage, imagePath);
    const fileRef = ref(storage, "songs/" + id + "/file/file");

    await uploadBytes(imageRef, songPreview);
    await uploadBytes(fileRef, file);

    const imageUrl = await getDownloadURL(ref(storage, imagePath));
    const fileUrl = await readSongFile(id);

    const songData = {
      name,
      image: imageUrl,
      id,
      uid,
      author,
      songLength,
      fileUrl,
    };
    await setDoc(songRef, songData);
    return id;
  } catch (error) {
    throw new Error("Error: can't write song into database");
  }
};
