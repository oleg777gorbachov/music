import { getAuth, updateEmail } from "firebase/auth";
export default async (email: string) => {
  try {
    const auth = getAuth();
    if (auth.currentUser) await updateEmail(auth.currentUser, email);
  } catch (error) {
    throw new Error("Error: can't update data");
  }
};
