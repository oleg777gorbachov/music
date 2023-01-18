import { getAuth, updatePassword } from "firebase/auth";
export default async (password: string) => {
  try {
    const user = getAuth().currentUser;
    if (user) {
      await updatePassword(user, password);
    }
  } catch (error) {
    throw new Error("Error: can't write data or don't valid password");
  }
};
