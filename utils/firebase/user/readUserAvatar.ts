import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default (uid: string) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, "users/" + uid + "/avatar");
    const avatar = getDownloadURL(storageRef);
    return avatar;
  } catch (error) {
    throw new Error("Error: can't read user data");
  }
};
