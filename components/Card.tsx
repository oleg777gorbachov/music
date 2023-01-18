import React, { ReactElement } from "react";
import s from "../styles/pages/card.module.scss";

type CardI = {
  children: ReactElement<any> | string | React.ReactNode;
  className?: string;
};

function Card({ children, className }: CardI) {
  return (
    <div className={className ? `${s.card} ${className}` : `${s.card}`}>
      {children}
    </div>
  );
}

export default Card;
