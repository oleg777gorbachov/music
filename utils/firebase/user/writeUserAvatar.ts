import { getStorage, ref, uploadBytes } from "firebase/storage";

export default async (uid: string, file: Blob) => {
  try {
    const storage = getStorage();
    const imageRef = ref(storage, "users/" + uid + "/avatar");
    const res = await uploadBytes(imageRef, file);
    return res;
  } catch (error) {
    throw new Error("Error: can't write user data");
  }
};
