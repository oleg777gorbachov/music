import React from "react";
import s from "../styles/pages/modal.module.scss";

type ModalI = {
  state: boolean;
  closeAction: (e: React.MouseEvent) => void;
  children: React.ReactElement | string | React.ReactNode;
  styles?: React.CSSProperties;
};

const closeStyles: React.CSSProperties = {
  opacity: 0,
  visibility: "hidden",
};

function Modal({ children, closeAction, state, styles }: ModalI) {
  return (
    <div
      className={s.modal_bg}
      onClick={closeAction}
      style={!state ? closeStyles : {}}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={s.modal_content}
        style={styles}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
