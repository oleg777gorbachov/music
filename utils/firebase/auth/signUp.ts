import { App } from "../cfg/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import writeUser from "../user/writeUser";
import { userOptionalI } from "../../../types/userOptionalI";

export default async (email: string, password: string, username: string) => {
  const auth = getAuth(App);
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userData: userOptionalI = {
      playlists: [],
      uid: user.uid,
      image: "/avatar.png",
      username,
      likelist: [],
      following: [],
      followers: [],
      songHistory: [],
      isVerified: false,
    };
    await writeUser(userData);
    return { user, optional: userData };
  } catch (error) {
    throw new Error("Error: can't write user data");
  }
};
