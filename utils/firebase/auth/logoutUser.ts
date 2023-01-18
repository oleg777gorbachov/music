import { getAuth } from "firebase/auth";
export default async () => {
  try {
    const auth = getAuth();
    await auth.signOut();
  } catch (error) {
    throw new Error("Error: can't verify data");
  }
};
