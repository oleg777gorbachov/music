import { getDownloadURL, getStorage, ref } from "firebase/storage";
export default async (id: string) => {
  const storage = getStorage();
  try {
    const fileRef = ref(storage, "songs/" + id + "/file/file");
    const res = await getDownloadURL(fileRef);
    return res;
  } catch (error) {
    throw new Error("Error: can't read song data");
  }
};
