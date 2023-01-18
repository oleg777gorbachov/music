import { getAuth, sendEmailVerification } from "firebase/auth";
export default async () => {
  try {
    const user = getAuth().currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  } catch (error) {
    throw new Error("Error: can't send link");
  }
};
