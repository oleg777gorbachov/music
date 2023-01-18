import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
export default async (password: string) => {
  try {
    const user = getAuth().currentUser;
    if (user && user.email) {
      const cred = await EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
    }
  } catch (error) {
    throw new Error("Error: don't valid password");
  }
};
