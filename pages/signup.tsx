import { ChangeEvent, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import MainConteiner from "../components/MainConteiner";
import NotificationBox from "../components/NotificationBox";
import emailValid from "../utils/emailValid";
import { initialErrorState } from "./login";
import s from "../styles/pages/login.module.scss";
import signUp from "../utils/firebase/auth/signUp";
import { useTypedDispatch } from "../hooks/useTypedDispatch";
import { userReducer } from "../redux/reducers/userReducer";
import Router from "next/router";
import { patches } from "../utils/patches";
import passValid from "../utils/passValid";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passRepeat, setPassRepeat] = useState("");

  const dispatch = useTypedDispatch();
  const { setUser } = userReducer.actions;

  const [isError, setIsError] = useState(initialErrorState);

  const usernameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsError(initialErrorState);
  };

  const emailHanlder = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsError(initialErrorState);
  };

  const passwordHanlder = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsError(initialErrorState);
  };

  const passRepeatHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassRepeat(e.target.value);
    setIsError(initialErrorState);
  };

  const onFinish = async () => {
    if (username.length < 2) {
      setIsError({
        state: true,
        message: "Username length should be more than 2",
        type: "ALERT",
      });
      return;
    }

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

    if (passRepeat !== password) {
      setIsError({
        state: true,
        message: "Please repeat your password",
        type: "ALERT",
      });
      return;
    }

    await signUp(email, password, username)
      .then((e) => {
        if (e.optional) {
          dispatch(
            setUser({
              email: email,
              followers: e.optional.followers,
              following: e.optional.following,
              isAuth: true,
              likelist: e.optional.likelist,
              uid: e.user.uid,
              username: e.optional.username,
              image: e.optional.image,
              playlists: e.optional.playlists,
              songHistory: e.optional.songHistory,
              isVerified: e.user.emailVerified,
            })
          );
          Router.push(patches.MYPROFILE);
        }
      })
      .catch((e) => {
        if (e.message === "Error: can't write user data") {
          setIsError({
            state: true,
            message: "Something went wrong, maybe user already exist",
            type: "DANGER",
          });
        }
      });
  };

  const onFinishBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <MainConteiner title="Musio.io Log in">
      <Card>
        <>
          <h2>Login</h2>
          <form className={s.form} onSubmit={onFinish}>
            <Input
              text="Username"
              type="text"
              value={username}
              onChange={usernameHandler}
            />
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
            <Input
              text="Repeat password"
              type="password"
              value={passRepeat}
              onChange={passRepeatHandler}
            />
            <Button text="Sign Up" onClick={onFinishBtn} />
          </form>
          <NotificationBox
            type={isError.type}
            text={isError.message}
            state={isError.state}
          />
        </>
      </Card>
    </MainConteiner>
  );
}

export default Signup;
