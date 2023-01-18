import { NextRouter } from "next/router";
import Image from "next/image";
import MainConteiner from "../../components/MainConteiner";
import readSong from "../../utils/firebase/songs/readSong";
import { HiPlay, HiPause } from "react-icons/hi";
import s from "../../styles/pages/song.module.scss";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { musicReducer } from "../../redux/reducers/musicReducer";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import toData from "../../utils/toData";
import updateLastLong from "../../utils/firebase/songs/updateLastLong";
import { AiFillHeart } from "react-icons/ai";
import { MusicI } from "../../types/MusicI";
import { audio } from "../../components/MainComponents/Player";
import { useCallback, useEffect, useMemo, useState } from "react";
import { userReducer } from "../../redux/reducers/userReducer";
import Button from "../../components/Button";
import addToLikeListFB from "../../utils/firebase/addToLikeListFB";
import removeFromLikeListFB from "../../utils/firebase/removeFromLikeListFB";
import ModalToLogin from "../../components/modals/ModalToLogin";
import ModalAddSongPL from "../../components/modals/ModalAddSongPL";
import readPlaylistAll from "../../utils/firebase/playlist/readPlaylistAll";
import { playlistReducer } from "../../redux/reducers/playlistReducer";
import A from "../../components/A";
import { patches } from "../../utils/patches";

function SongPage(props: MusicI) {
  const {
    author,
    duration,
    fileURL: fileUrl,
    id: songId,
    imageURL,
    songName,
    authorID,
  } = props;

  const [modalState, setModalState] = useState(false);
  const [playlistAdd, setPlaylistAdd] = useState(false);

  const dispatch = useTypedDispatch();

  const { nowLength, state, fileURL, id } = useTypedSelector(
    (store) => store.music
  );
  const { isAuth, uid, likelist, playlists } = useTypedSelector(
    (store) => store.user
  );

  const { playSongAction, setCurrentAction, stopSongAction, setSongAction } =
    musicReducer.actions;
  const { removeFromLikeList, addToLikeList } = userReducer.actions;
  const { setPlaylistAction } = playlistReducer.actions;
  const isOnPlaylist = useMemo(() => playlists.includes(id), [playlists, id]);

  useEffect(() => {
    if (playlists.length > 1)
      readPlaylistAll(playlists).then((e) => dispatch(setPlaylistAction(e)));
  }, [playlists, dispatch, setPlaylistAction]);

  const currentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.currentTime = nowLength;
    dispatch(setCurrentAction(Math.round(+e.target.value)));
  };

  const playSong = async () => {
    if (fileURL !== fileUrl) {
      dispatch(setSongAction({ ...props, listToPlay: "SINGLESONG" }));
    }
    setTimeout(() => dispatch(playSongAction()));

    if (isAuth) {
      await updateLastLong(songId, uid);
    }
    localStorage.setItem("LastSong", songId);
  };

  const stopSong = () => {
    dispatch(stopSongAction());
  };

  const addToLikeListHandler = useCallback(async () => {
    if (isAuth) {
      dispatch(addToLikeList(id));
      await addToLikeListFB(uid, id);
    } else {
      setModalState(true);
    }
  }, [addToLikeList, dispatch, id, isAuth, uid]);

  const removeFromLikeListHandler = useCallback(async () => {
    if (isAuth) {
      dispatch(removeFromLikeList(id));
      await removeFromLikeListFB(uid, id);
    } else {
      setModalState(true);
    }
  }, [dispatch, id, isAuth, removeFromLikeList, uid]);

  const addToPlaylist = () => {
    setPlaylistAdd(true);
  };

  const isOnLikeList = useMemo(() => {
    if (likelist.includes(songId)) {
      return (
        <AiFillHeart
          className={s.likeinclude}
          onClick={removeFromLikeListHandler}
        />
      );
    }

    return <AiFillHeart className={s.like} onClick={addToLikeListHandler} />;
  }, [likelist, addToLikeListHandler, id, removeFromLikeListHandler, songId]);

  const ButtonPlaylist = useMemo(() => {
    if (isAuth) {
      if (isOnPlaylist) {
        return <Button text="Remove from playlist" onClick={addToPlaylist} />;
      }

      return <Button text="Add to playlist" onClick={addToPlaylist} />;
    }
  }, [isOnPlaylist, isAuth]);

  return (
    <MainConteiner title="Musio.io Song" image={imageURL}>
      <div className={s.container}>
        <div>
          <div className={s.item}>
            <h2>{songName}</h2>
            {isOnLikeList}
          </div>
          <A path={patches.PROFILE} className={s.author}>
            {author}
          </A>
          <div className={s.player}>
            {state === "PLAY" && id === songId ? (
              <HiPause className={s.play} onClick={stopSong} />
            ) : (
              <HiPlay className={s.play} onClick={playSong} />
            )}
            <span>{id === songId ? toData(nowLength) : toData(0)}</span>
            {id === songId ? (
              <input
                type="range"
                value={nowLength}
                onChange={currentHandler}
                className={s.volumeInput}
                min="0"
                max={duration}
                step={duration / 103}
                style={{ border: "none" }}
              ></input>
            ) : (
              <div className={s.line}></div>
            )}

            <span>{toData(duration)}</span>
          </div>
          {ButtonPlaylist}
        </div>
        <Image
          src={imageURL}
          alt="Song image"
          width={256}
          height={256}
          className={s.image}
        />
      </div>
      <ModalToLogin setState={setModalState} state={modalState} />
      <ModalAddSongPL
        setState={setPlaylistAdd}
        state={playlistAdd}
        songId={songId}
      />
    </MainConteiner>
  );
}

export default SongPage;

export async function getServerSideProps(uid: NextRouter) {
  const id = uid.query.id;

  if (typeof id === "string") {
    const res = await readSong(id).catch((e) => {
      return { notFound: true };
    });
    if (res === undefined) return { notFound: true };

    return { props: res };
  }
  return { notFound: true };
}
