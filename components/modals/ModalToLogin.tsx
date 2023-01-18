import Router from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { patches } from "../../utils/patches";
import Button from "../Button";
import Modal from "../Modal";

type ModalToLoginI = {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
};

function ModalToLogin({ setState, state }: ModalToLoginI) {
  return (
    <Modal state={state} closeAction={() => setState(false)}>
      <h2>Please login to your account</h2>
      <Button
        text="Login"
        onClick={() => Router.push(patches.LOGIN)}
        style={{ marginBottom: "0" }}
      />
    </Modal>
  );
}

export default ModalToLogin;
