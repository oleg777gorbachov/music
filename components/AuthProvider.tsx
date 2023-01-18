import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useTypedDispatch } from "../hooks/useTypedDispatch";
import readUser from "../utils/firebase/user/readUser";
import { userReducer, UserReducerType } from "../redux/reducers/userReducer";
import updateVerifyEmail from "../utils/firebase/user/updateVerifyEmail";

type AuthProviderI = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderI) {
  const dispatch = useTypedDispatch();
  const { setUser } = userReducer.actions;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const data = await readUser(uid);

        if (data) {
          const userData: UserReducerType = {
            email: user.email!,
            image: data.image,
            isAuth: true,
            likelist: data.likelist,
            playlists: data.playlists,
            songHistory: data.songHistory,
            uid,
            username: data.username,
            followers: data.followers,
            following: data.following,
            isVerified: user.emailVerified,
          };
          if (!data.isVerified && user.emailVerified) {
            await updateVerifyEmail(user.uid);
          }
          dispatch(setUser(userData));
        }
      }
    });
  }, [dispatch, setUser]);

  return <>{children}</>;
}

export default AuthProvider;
