import { doc, setDoc, getFirestore } from "firebase/firestore";
import { userOptionalI } from "../../../types/userOptionalI";
import { App } from "../cfg/firebaseConfig";

export default async ({
  playlists,
  followers,
  following,
  likelist,
  uid,
  username,
  image,
  songHistory,
  isVerified,
}: userOptionalI) => {
  const db = getFirestore(App);
  try {
    const userRef = doc(db, "users/" + uid);
    const userData = {
      uid,
      username,
      playlists,
      followers,
      image,
      following,
      likelist,
      songHistory,
      isVerified,
    };
    await setDoc(userRef, userData);
  } catch (error) {
    throw new Error("Error: can't write user data");
  }
};
