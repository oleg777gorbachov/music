import React from "react";
import s from "../styles/pages/notification.module.scss";

export type NotificationI = {
  type: "ALERT" | "DANGER" | "GOOD";
  text: string;
  state: boolean;
};

const offScreen: React.CSSProperties = {
  opacity: 0,
  visibility: "hidden",
  height: 0,
  padding: 0,
};
const onScreen: React.CSSProperties = { opacity: 1, visibility: "initial" };

function NotificationBox({ type, text, state }: NotificationI) {
  if (type === "DANGER") {
    return (
      <div
        className={`${s.box} ${s.box_danger} `}
        style={state ? onScreen : offScreen}
      >
        {text}
      </div>
    );
  }

  if (type === "ALERT") {
    return (
      <div
        className={`${s.box} ${s.box_alert} `}
        style={state ? onScreen : offScreen}
      >
        {text}
      </div>
    );
  }

  return (
    <div className={s.box} style={state ? onScreen : offScreen}>
      {text}
    </div>
  );
}

export default NotificationBox;
