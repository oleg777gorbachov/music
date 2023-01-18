import Router from "next/router";
import React, { ChangeEvent, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import MainConteiner from "../components/MainConteiner";
import NotificationBox from "../components/NotificationBox";
import { useTypedDispatch } from "../hooks/useTypedDispatch";
import { userReducer } from "../redux/reducers/userReducer";
import s from "../styles/pages/login.module.scss";
import emailValid from "../utils/emailValid";
import readUserAvatar from "../utils/firebase/user/readUserAvatar";
import signIn from "../utils/firebase/auth/signIn";
import { patches } from "../utils/patches";
import updateVerifyEmail from "../utils/firebase/user/updateVerifyEmail";
import passValid from "../utils/passValid";
import sendResetPass from "../utils/firebase/auth/sendResetPass";

export type ErrorI = {
  state: boolean;
  message: string;
  type: "ALERT" | "DANGER";
};

export const initialErrorState: ErrorI = {
  state: false,
  message: "",
  type: "ALERT",
};

function Login() {
  const [isForget, setIsForget] = useState({
    state: false,
    isSend: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(initialErrorState);

  const dispatch = useTypedDispatch();
  const { setUser } = userReducer.actions;

  const emailHanlder = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsError(initialErrorState);
  };

  const passwordHanlder = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsError(initialErrorState);
  };

  const onFinish = async () => {
    if (!emailValid(email)) {
      setIsError({
        state: true,
        message: "Don't valid email",
        type: "ALERT",
      });
      return;
    }

    if (!passValid(password)) {
      setIsError({
        state: true,
        message: "Password length should be more than 6",
        type: "ALERT",
      });
      return;
    }

    await signIn(email, password)
      .then(async (e) => {
        if (e.optional) {
          const imageURL = await readUserAvatar(e.user.uid);
          if (e.user.emailVerified && !e.optional.isVerified) {
            await updateVerifyEmail(e.user.uid);
          }
          dispatch(
            setUser({
              email: email,
              followers: e.optional.followers,
              following: e.optional.following,
              isAuth: true,
              likelist: e.optional.likelist,
              uid: e.user.uid,
              username: e.optional.username,
              image: imageURL,
              playlists: e.optional.playlists,
              songHistory: e.optional.songHistory,
              isVerified: e.user.emailVerified,
            })
          );
          Router.push(patches.MYPROFILE);
        }
      })
      .catch((e) => {
        setIsError({
          state: true,
          message: "Something went wrong, maybe user already exist",
          type: "DANGER",
        });
      });
  };

  const onFinishForget = async () => {
    if (!emailValid(email)) {
      setIsError({
        state: true,
        message: "Don't valid email",
        type: "ALERT",
      });
      return;
    }

    await sendResetPass(email);
    setIsForget({ isSend: true, state: true });
  };

  const onFinishBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    onFinish();
  };

  const onFinishForgetBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    onFinishForget();
  };

  return (
    <MainConteiner title="Musio.io Log in">
      {!isForget.state ? (
        <Card>
          <h2>Login</h2>
          <form className={s.form} onSubmit={onFinish}>
            <Input
              text="Email"
              type="email"
              value={email}
              onChange={emailHanlder}
            />
            <Input
              text="Password"
              type="password"
              value={password}
              onChange={passwordHanlder}
            />
            <Button text="Log In" onClick={onFinishBtn} />
          </form>
          <h3 onClick={() => setIsForget({ state: true, isSend: false })}>
            Forget password? <strong>Reset it</strong>
          </h3>
          <NotificationBox
            type={isError.type}
            text={isError.message}
            state={isError.state}
          />
        </Card>
      ) : (
        <Card>
          <h2>Reset password</h2>
          <form className={s.form} onSubmit={onFinishForget}>
            <Input
              text="Email"
              type="email"
              value={email}
              onChange={emailHanlder}
            />
            <Button text="Send reset link" onClick={onFinishForgetBtn} />
          </form>
          <h3
            onClick={() => setIsForget({ state: false, isSend: false })}
            style={{ marginBottom: "1rem" }}
          >
            Back
          </h3>
          <NotificationBox
            type={isError.type}
            text={isError.message}
            state={isError.state}
          />
          <NotificationBox
            state={isForget.isSend}
            text="Reset link sended"
            type="GOOD"
          />
        </Card>
      )}
    </MainConteiner>
  );
}

export default Login;
