import { NextRouter } from "next/router";
import React, { useMemo, useState } from "react";
import A from "../../components/A";
import Card from "../../components/Card";
import MainConteiner from "../../components/MainConteiner";
import SongItem from "../../components/SongItem";
import { MusicI } from "../../types/MusicI";
import { PlaylistI } from "../../types/PlaylistI";
import readPlaylist from "../../utils/firebase/playlist/readPlaylist";
import { patches } from "../../utils/patches";
import { AiFillHeart } from "react-icons/ai";
import s from "../../styles/pages/song.module.scss";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import ModalToLogin from "../../components/modals/ModalToLogin";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { userReducer } from "../../redux/reducers/userReducer";
import addLikeOnPlayList from "../../utils/firebase/playlist/addLikeOnPlayList";
import { AiOutlineEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import ErrorPage from "../404";
import removeFromLikeListFB from "../../utils/firebase/removeFromLikeListFB";
import { playlistReducer } from "../../redux/reducers/playlistReducer";
import playlistRemoveSong from "../../utils/firebase/playlist/playlistRemoveSong";

type PlaylistPageI = {
  playlist: PlaylistI;
  songs: MusicI[];
  isError?: boolean;
};

function PlaylistPage({ playlist, songs, isError }: PlaylistPageI) {
  const dispatch = useTypedDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const { author, authorID, name, id } = playlist;
  const { playlists, uid, isAuth } = useTypedSelector((store) => store.user);
  const [modalState, setModalState] = useState(false);
  const { addToPlaylist, removeFromPlaylist } = userReducer.actions;
  const { removeSongFromPlaylistAction } = playlistReducer.actions;

  const removeFromPL = async () => {
    dispatch(removeFromPlaylist(id));
    await removeFromLikeListFB(uid, id);
  };

  const addToPL = async () => {
    if (isAuth) {
      dispatch(addToPlaylist(id));
      await addLikeOnPlayList(uid, id);
    } else {
      setModalState(true);
    }
  };

  const isOnLikeList = useMemo(() => {
    if (authorID === uid) {
      return (
        <AiOutlineEdit
          className={s.like}
          onClick={() => setIsEdit((prev) => !prev)}
        />
      );
    }
    if (playlists.includes(id)) {
      return <AiFillHeart className={s.likeinclude} onClick={removeFromPL} />;
    }

    return <AiFillHeart className={s.like} onClick={addToPL} />;
  }, [addToPL, authorID, id, playlists, removeFromPL, uid]);

  const items = useMemo(() => {
    if (isEdit) {
      return songs.map((e) => {
        const removeTrackFromPlaylist = async () => {
          dispatch(
            removeSongFromPlaylistAction({
              playlistId: id,
              songId: e.id,
            })
          );
          await playlistRemoveSong(id, e.id);
        };
        return (
          <div className={s.container} key={e.id}>
            <SongItem
              author={e.author}
              name={e.songName}
              image={e.imageURL}
              duration={e.duration}
              fileURL={e.fileURL}
              listToPlay="PLAYLIST"
              id={e.id}
              type="STRETCH"
              authorID={e.authorID}
            />
            <FiTrash2
              style={{ fontSize: "2.5rem", cursor: "pointer" }}
              onClick={removeTrackFromPlaylist}
            />
          </div>
        );
      });
    }
    return songs.map((e) => {
      return (
        <SongItem
          author={e.author}
          name={e.songName}
          image={e.imageURL}
          id={e.id}
          key={e.id}
          duration={e.duration}
          fileURL={e.fileURL}
          listToPlay="PLAYLIST"
          authorID={e.authorID}
          type="STRETCH"
        />
      );
    });
  }, [songs, isEdit, dispatch, id, removeSongFromPlaylistAction]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <MainConteiner
      title="Musio io playlist"
      image={songs[0] && songs[0].imageURL}
    >
      <Card>
        <div className={s.container} style={{ marginBottom: "1rem" }}>
          <h2>
            Playlist: {name} by{" "}
            <A path={patches.PROFILE + authorID}>
              <em>{author}</em>
            </A>
          </h2>
          {isOnLikeList}
        </div>

        <div>{items.length > 0 ? items : "Nothing there"}</div>
      </Card>
      <ModalToLogin setState={setModalState} state={modalState} />
    </MainConteiner>
  );
}

export default PlaylistPage;

export async function getServerSideProps(uid: NextRouter) {
  const id = uid.query.id;
  if (typeof id === "string") {
    const res = await readPlaylist(id).catch((e) => {
      return { notFound: true };
    });
    if (res === undefined) return { notFound: true };
    return { props: res };
  }
  return { notFound: true };
}
