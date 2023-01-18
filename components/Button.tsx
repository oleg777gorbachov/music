import React from "react";
import s from "../styles/pages/button.module.scss";

type ButtonI = {
  text: string;
  style?: React.CSSProperties;
  className?: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

function Button({ text, style, onClick, className, isDisabled }: ButtonI) {
  return (
    <button
      className={`${s.button} ${className}`}
      style={style}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}

export default Button;
