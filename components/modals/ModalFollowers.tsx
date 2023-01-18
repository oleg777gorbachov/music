import React, { useEffect, useMemo, useState } from "react";
import { userOptionalI } from "../../types/userOptionalI";
import readUser from "../../utils/firebase/user/readUser";
import { patches } from "../../utils/patches";
import A from "../A";
import s from "../../styles/pages/profile.module.scss";
import Image from "next/image";

type ModalFollowersI = {
  followersArray: string[];
  title: string;
};

function ModalFollowers({ followersArray, title }: ModalFollowersI) {
  const [followers, setFollowers] = useState<userOptionalI[]>([]);

  useEffect(() => {
    if (followers.length === 0) {
      (async () => {
        const data: any[] = [];
        for (let key of followersArray) {
          const user = await readUser(key);
          if (data) data.push(user);
        }
        setFollowers(data);
      })();
    }
  }, [followers.length, followersArray]);

  const followersHTML = useMemo(() => {
    return followers.map((e) => {
      return (
        <div key={e.uid} className={s.username}>
          <Image src={e.image} alt="user-avatar" width={32} height={32} />
          <A path={patches.PROFILE + e.uid}>{e.username}</A>
        </div>
      );
    });
  }, [followers]);

  return (
    <>
      <h2 style={{ marginBottom: "0.5rem" }}> {title}</h2>
      {followersArray.length === 0 ? "There's nothing" : followersHTML}
    </>
  );
}

export default ModalFollowers;
