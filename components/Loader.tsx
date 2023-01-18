import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import s from "../styles/pages/loader.module.scss";

function Loader() {
  return (
    <div className={s.container}>
      <AiOutlineLoading3Quarters className={s.item} />
    </div>
  );
}

export default Loader;
