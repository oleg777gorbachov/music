import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import s from "../styles/pages/Home.module.scss";
import A from "./A";
import { patches } from "../utils/patches";
import { HiPlay, HiPause } from "react-icons/hi";
import { audio } from "./MainComponents/Player";
import { useTypedDispatch } from "../hooks/useTypedDispatch";
import { musicReducer } from "../redux/reducers/musicReducer";
import { useTypedSelector } from "../hooks/useTypedSelector";
import updateLastLong from "../utils/firebase/songs/updateLastLong";
import toData from "../utils/toData";
import { userReducer } from "../redux/reducers/userReducer";
import { AiFillHeart } from "react-icons/ai";
import removeFromLikeListFB from "../utils/firebase/removeFromLikeListFB";
import { likelistReducer } from "../redux/reducers/likelistReducer";
import { listToPlayI } from "../types/listToPlayI";
import { MusicI } from "../types/MusicI";

type SongItemI = {
  author: string;
  name: string;
  image: string;
  id: string;
  fileURL: string;
  duration: number;
  authorID: string;
  isHeart?: { isOnLikeList: boolean };
  type?: "STRETCH";
} & listToPlayI;

function SongItem({
  author,
  image,
  name,
  id,
  type,
  fileURL,
  duration,
  listToPlay,
  isHeart,
  authorID,
}: SongItemI) {
  const dispatch = useTypedDispatch();
  const { isAuth, uid } = useTypedSelector((store) => store.user);
  const {
    id: songIdUser,
    state,
    nowLength,
  } = useTypedSelector((store) => store.music);
  const song: MusicI = {
    author,
    imageURL: image,
    songName: name,
    id,
    fileURL,
    duration,
    authorID,
  };

  const { addSongHistory, removeFromLikeList } = userReducer.actions;
  const { removeSongFromLikeListAction } = likelistReducer.actions;
  const { stopSongAction, playSongAction, setSongAction, setCurrentAction } =
    musicReducer.actions;

  const stopSong = useCallback(() => {
    audio.pause();
    dispatch(stopSongAction());
  }, [dispatch, stopSongAction]);

  const playSong = useCallback(async () => {
    const localSong = localStorage.getItem("LastSong");
    if (id !== localSong && localSong && isAuth) {
      await updateLastLong(localSong, uid);
    }
    localStorage.setItem("LastSong", id);

    dispatch(addSongHistory(id));
    if (!type) dispatch(setSongAction({ ...song, listToPlay, isReset: true }));
    else dispatch(setSongAction({ ...song, listToPlay }));

    setTimeout(() => {
      audio.play();
      dispatch(playSongAction());
    });
  }, [
    addSongHistory,
    dispatch,
    id,
    isAuth,
    setSongAction,
    playSongAction,
    song,
    uid,
  ]);

  const currentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.currentTime = nowLength;
    if (audio.src !== fileURL) {
      playSong();
    }
    dispatch(setCurrentAction(Math.round(+e.target.value)));
  };

  const removeFromLikelist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(removeFromLikeList(id));
    dispatch(removeSongFromLikeListAction(id));
    removeFromLikeListFB(uid, id);
  };

  const playComp = useMemo(() => {
    if (id === songIdUser) {
      if (state === "PLAY") return <></>;
      return (
        <div className={s.play} onClick={playSong}>
          <HiPlay />
        </div>
      );
    }
    return (
      <div className={s.play} onClick={playSong}>
        <HiPlay />
      </div>
    );
  }, [songIdUser, id, state, playSong]);

  const stopComp = useMemo(() => {
    if (id === songIdUser && state === "PLAY") {
      return (
        <div className={s.stop} onClick={stopSong}>
          <HiPause />
        </div>
      );
    }
  }, [songIdUser, id, state, stopSong]);

  if (type === "STRETCH") {
    return (
      <div className={s.songStretch}>
        <div className={s.parent}>
          {playComp}
          {stopComp}
          <Image src={image} alt="Song preview" width={100} height={100} />
        </div>
        <div style={{ width: "100%" }}>
          <A path={patches.SONG + id} className={s.link}>
            <h2 className={s.item}>
              {name}
              {isHeart && (
                <AiFillHeart className={s.heart} onClick={removeFromLikelist} />
              )}
            </h2>
            <p>{author}</p>
          </A>
          <div className={s.input}>
            {id === songIdUser ? toData(nowLength) : toData(0)}
            <input
              type="range"
              value={songIdUser === id ? nowLength : 0}
              id={s.time}
              min="0"
              max={duration}
              onChange={currentHandler}
              step={duration / 103}
            />
            {toData(duration)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.songItem}>
      <div className={s.parent}>
        {playComp}
        {stopComp}
        <Image src={image} alt="Song preview" width={200} height={200} />
      </div>
      <A path={patches.SONG + id} className={s.link}>
        <h2>{name}</h2>
        <p>{author}</p>
      </A>
    </div>
  );
}

export default React.memo(SongItem);
