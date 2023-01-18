import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default async (email: string) => {
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error("Error: can't send data");
  }
};
