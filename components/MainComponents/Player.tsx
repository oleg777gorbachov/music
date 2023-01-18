import React, { useCallback, useEffect, useState } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import toData from "../../utils/toData";
import { HiVolumeUp, HiPlay, HiPause } from "react-icons/hi";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { musicReducer } from "../../redux/reducers/musicReducer";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import updateLastLong from "../../utils/firebase/songs/updateLastLong";
import s from "../../styles/pages/Nav.module.scss";
import { MusicI } from "../../types/MusicI";
import getRandomSong from "../../utils/firebase/songs/getRandomSong";
import { patches } from "../../utils/patches";
import A from "../A";
import { userReducer } from "../../redux/reducers/userReducer";

const hideStyles: React.CSSProperties = {
  width: 0,
  opacity: 0,
};

const showStyles: React.CSSProperties = {
  width: 200,
  opacity: 1,
};

export let audio: HTMLAudioElement;

function Player() {
  const [isSmall, setIsSmall] = useState(false);
  const [windowWidth, setWindowWidth] = useState(-1);

  const {
    volume,
    state,
    nowLength,
    duration,
    songName,
    id,
    fileURL,
    listToPlay,
  } = useTypedSelector((store) => store.music);
  const { likelist, playlists, songStore, songHistory } = useTypedSelector(
    (store) => store
  );
  const { isAuth, uid } = useTypedSelector((store) => store.user);
  const {
    playSongAction,
    stopSongAction,
    playingAction,
    setVolumeAction,
    setCurrentAction,
    setSongAction,
    resetSongAction,
  } = musicReducer.actions;
  const { addSongHistory } = userReducer.actions;

  const dispatch = useTypedDispatch();

  const playSong = useCallback(async () => {
    localStorage.setItem("LastSong", id);
    if (isAuth) {
      await updateLastLong(id, uid);
    }

    dispatch(addSongHistory(id));

    if (audio) {
      audio.play();
      dispatch(playSongAction());
    }
  }, [addSongHistory, dispatch, id, isAuth, playSongAction, uid]);

  const stopSong = useCallback(() => {
    if (audio) {
      audio.pause();
      dispatch(stopSongAction());
    }
  }, [dispatch, stopSongAction]);

  const volumeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.volume = volume;
    dispatch(setVolumeAction(+e.target.value));
  };

  const currentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.currentTime = nowLength;
    dispatch(setCurrentAction(Math.round(+e.target.value)));
  };

  const getNextSong = useCallback(async () => {
    let song: MusicI | null = null;
    let songid = -1;

    if (listToPlay === "GLOBALSTORE") {
      const songs = songStore.StoreSongs;
      songs.map((e, index) => (e.id === id ? (songid = index + 1) : null));
      if (songs[songid]) {
        song = songs[songid];
      } else song = songs[0];
    } else if (listToPlay === "HISTORYSONGS") {
      const songs = songHistory.historySongs;
      songs.map((e, index) => (e.id === id ? (songid = index + 1) : null));
      if (songs[songid]) {
        song = songs[songid];
      } else song = songs[0];
    } else if (listToPlay === "LIKELIST") {
      const songs = likelist.likelistSongs;
      songs.map((e, index) => (e.id === id ? (songid = index + 1) : null));
      if (songs[songid]) {
        song = songs[songid];
      } else song = songs[0];
    } else {
      await getRandomSong();
    }

    if (song) {
      audio.currentTime = 0;
      dispatch(setSongAction({ ...song, listToPlay, isReset: true }));
    }
    setTimeout(() => playSong());
  }, [dispatch, id, playSong, setSongAction, songStore, songHistory, likelist]);

  const getPrevSong = async () => {
    let song: MusicI | null = null;
    let songid = -1;

    if (listToPlay === "GLOBALSTORE") {
      const songs = songStore.StoreSongs;
      songs.map((e, index) => (e.id === id ? (songid = index - 1) : null));
      if (songs[songid]) {
        song = songs[songid];
      } else song = songs[0];
    } else if (listToPlay === "HISTORYSONGS") {
      const songs = songHistory.historySongs;
      songs.map((e, index) => (e.id === id ? (songid = index - 1) : null));
      if (songs[songid]) {
        song = songs[songid];
      } else song = songs[0];
    } else if (listToPlay === "LIKELIST") {
      const songs = likelist.likelistSongs;
      songs.map((e, index) => (e.id === id ? (songid = index - 1) : null));
      if (songs[songid]) {
        song = songs[songid];
      } else song = songs[0];
    } else {
      await getRandomSong();
    }

    if (song) {
      audio.currentTime = 0;
      dispatch(setSongAction({ ...song, listToPlay, isReset: true }));
    }

    setTimeout(() => {
      audio.currentTime = 0;
      playSong();
    });
  };

  useEffect(() => {
    if (windowWidth < 768 && windowWidth !== -1) audio.volume = 1;
  }, [windowWidth]);

  useEffect(() => {
    let interval: any;

    if (state === "PLAY") {
      playSong();
      interval = setInterval(() => {
        dispatch(playingAction());
      }, 1000);
    }

    if (state === "PAUSE") {
      stopSong();
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [state, dispatch, playSong, stopSong, playingAction]);

  useEffect(() => {
    if (audio) {
      if (audio.src !== fileURL) audio.src = fileURL;
    }
  }, [fileURL]);

  useEffect(() => {
    if (nowLength === duration && duration !== -1) {
      getNextSong();
    }
  }, [nowLength, duration, getNextSong]);

  useEffect(() => {
    if (!audio) {
      audio = new Audio(fileURL);
      audio.volume = volume;
      audio.ontimeupdate = () => {
        setCurrentAction(audio.currentTime);
      };
    }

    const resize = () => {
      setWindowWidth(window.screen.availWidth);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [fileURL, setCurrentAction, volume]);

  return (
    <div className={s.player}>
      <div>
        <BiSkipPrevious className={s.icon} onClick={getPrevSong} />
        {state === "PLAY" ? (
          <HiPause className={s.icon} onClick={stopSong} />
        ) : (
          <HiPlay className={s.icon} onClick={playSong} />
        )}

        <BiSkipNext className={s.icon} onClick={getNextSong} />
      </div>
      <A path={patches.SONG + id} className={s.songName}>
        <div>{songName}</div>
      </A>

      <span>
        {toData(nowLength)} / {toData(duration)}
      </span>
      {windowWidth > 768 ? (
        <HiVolumeUp
          className={s.volume}
          onClick={() => setIsSmall((prev) => !prev)}
        />
      ) : null}

      <input
        type="range"
        value={volume}
        onChange={volumeHandler}
        className={s.volumeInput}
        min="0"
        max="1"
        step="0.01"
        style={isSmall ? hideStyles : showStyles}
      ></input>

      <input
        type="range"
        value={nowLength}
        onChange={currentHandler}
        className={s.volumeInput}
        id={s.time}
        min="0"
        max={duration}
        step={duration / 103}
      ></input>
    </div>
  );
}

export default Player;
