import { NextRouter } from "next/router";
import React, { useState } from "react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import MainConteiner from "../../../components/MainConteiner";
import NotificationBox from "../../../components/NotificationBox";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { userOptionalI } from "../../../types/userOptionalI";
import sendLinkToVerify from "../../../utils/firebase/auth/sendLinkToVerify";
import readUser from "../../../utils/firebase/user/readUser";
import ErrorPage from "../../404";
import { MdVerified } from "react-icons/md";
import s from "../../../styles/pages/profile.module.scss";
import ModalChangePass from "../../../components/modals/ModalChangePass";
import ModalChangeMail from "../../../components/modals/ModalChangeMail";

function ProfileSettings(props: userOptionalI) {
  const [isVerificationSend, setIsVerificationSend] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [isChangeMail, setIsChangeMail] = useState(false);

  const [isChangePass, setIsChangePass] = useState(false);

  const {
    followers,
    following,
    image,
    likelist,
    username,
    playlists,
    uid,
    songHistory,
    isVerified,
  } = props;

  const { uid: userUID } = useTypedSelector((store) => store.user);
  const isMyProfile = uid === userUID;

  const sendEmailVerification = async () => {
    if (!isVerified) {
      await sendLinkToVerify();
      setIsVerificationSend(true);
    } else {
      setIsAlreadyVerified(true);
    }
  };

  if (!isMyProfile) {
    return <ErrorPage />;
  }

  return (
    <MainConteiner title="Musio.io settings" image={image}>
      <Card>
        <h2
          className={s.item}
          style={{ justifyContent: "flex-start", gap: "1rem" }}
        >
          Settings {isVerified && <MdVerified className={s.verified} />}
        </h2>
        <div>
          <Button text="Verify email" onClick={sendEmailVerification} />
          <Button
            text="Change password"
            style={{ margin: "1rem" }}
            onClick={() => setIsChangePass(true)}
          />
          <Button text="Change email" onClick={() => setIsChangeMail(true)} />
        </div>
        <NotificationBox
          state={isVerificationSend}
          text="Notification send, check your mail"
          type="GOOD"
        />
        <NotificationBox
          state={isAlreadyVerified}
          text="Your email is already verified"
          type="ALERT"
        />
      </Card>
      <ModalChangeMail setState={setIsChangeMail} state={isChangeMail} />
      <ModalChangePass setState={setIsChangePass} state={isChangePass} />
    </MainConteiner>
  );
}

export default ProfileSettings;

ProfileSettings.getInitialProps = async (uid: NextRouter) => {
  const id = uid.query.uid;
  if (typeof id === "string") {
    const res = await readUser(id).catch((e) => {
      return { notFound: true };
    });
    if (res === undefined) return { notFound: true };
    if (res) return res;
  }
  return { notFound: true };
};
