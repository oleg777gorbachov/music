import { updatePassword } from "firebase/auth";
import React, { useState } from "react";
import checkPassword from "../../utils/firebase/auth/checkPassword";
import updatePasswordUser from "../../utils/firebase/auth/updatePasswordUser";
import passValid from "../../utils/passValid";
import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";
import NotificationBox, { NotificationI } from "../NotificationBox";

type ModalChangePassI = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

function ModalChangePass({ setState, state }: ModalChangePassI) {
  const [isVerify, setIsVerify] = useState(false);
  const [nowPass, setNowPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [nottifState, setNottifState] = useState<NotificationI>({
    state: false,
    text: "",
    type: "ALERT",
  });

  const closeAction = () => setState(false);

  const nowPassHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNowPass(e.target.value);
    if (nottifState.state) {
      setNottifState({
        state: false,
        text: "",
        type: "ALERT",
      });
    }
  };

  const PassHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(e.target.value);
    if (nottifState.state) {
      setNottifState({
        state: false,
        text: "",
        type: "ALERT",
      });
    }
  };

  const onFinishNowPass = async () => {
    let isValid = true;

    if (
      (nottifState.state === true && nottifState.type === "ALERT") ||
      nottifState.type === "DANGER"
    ) {
      return;
    }

    if (!passValid(nowPass)) {
      setNottifState({
        state: true,
        text: "Don't valid password",
        type: "ALERT",
      });
      return;
    }

    await checkPassword(nowPass).catch((e) => {
      setNottifState({
        state: true,
        text: "Invalid password",
        type: "DANGER",
      });
      isValid = false;
    });

    if (isValid) {
      setIsVerify(true);
      setNowPass("");
    }
  };

  const onFinishNowPassBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    onFinishNowPass();
  };

  const onFinishPass = async () => {
    if (!passValid(newPass)) {
      setNottifState({
        state: true,
        text: "Don't valid password",
        type: "ALERT",
      });
      return;
    }

    await updatePasswordUser(newPass).catch((e) => {
      setNottifState({
        state: true,
        text: "Something went wrong",
        type: "DANGER",
      });
    });

    setNottifState({
      state: true,
      text: "Your password is updated",
      type: "GOOD",
    });

    setNewPass("");
  };

  const onFinishPassBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    onFinishPass();
  };

  return (
    <Modal closeAction={closeAction} state={state}>
      {!isVerify ? (
        <>
          <h2 style={{ marginBottom: "1rem" }}>Type your password</h2>
          <form onSubmit={onFinishNowPass}>
            <Input
              text="Your password"
              type="password"
              value={nowPass}
              onChange={nowPassHandler}
            />
          </form>
          <Button text="Check password" onClick={onFinishNowPassBtn} />
          <NotificationBox
            state={nottifState.state}
            text={nottifState.text}
            type={nottifState.type}
          />
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: "1rem" }}>Type your new password</h2>
          <form onSubmit={onFinishPass}>
            <Input
              text="Your password"
              type="password"
              value={newPass}
              onChange={PassHandler}
            />
          </form>
          <Button text="Check password" onClick={onFinishPassBtn} />
          <NotificationBox
            state={nottifState.state}
            text={nottifState.text}
            type={nottifState.type}
          />
        </>
      )}
    </Modal>
  );
}

export default ModalChangePass;
