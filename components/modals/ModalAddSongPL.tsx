import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import Modal from "../../components/Modal";
import { FiTrash2 } from "react-icons/fi";
import { IoAddSharp } from "react-icons/io5";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import s from "../../styles/pages/song.module.scss";
import A from "../A";
import { patches } from "../../utils/patches";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { playlistReducer } from "../../redux/reducers/playlistReducer";
import playlistAddSong from "../../utils/firebase/playlist/playlistAddSong";
import playlistRemoveSong from "../../utils/firebase/playlist/playlistRemoveSong";
import readPlaylistAll from "../../utils/firebase/playlist/readPlaylistAll";

type ModalAddSongPLI = {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  songId: string;
};

function ModalAddSongPL({ setState, state, songId }: ModalAddSongPLI) {
  const closeAction = () => {
    setState(false);
  };

  const { addSongToPlaylistAction, removeSongFromPlaylistAction } =
    playlistReducer.actions;
  const { playlists } = useTypedSelector((store) => store.playlists);
  const { playlists: userPlaylists } = useTypedSelector((store) => store.user);
  const dispatch = useTypedDispatch();
  const { setPlaylistAction } = playlistReducer.actions;

  useEffect(() => {
    if (playlists.length === 0) {
      readPlaylistAll(userPlaylists).then((e) =>
        dispatch(setPlaylistAction(e))
      );
    }
  }, [userPlaylists]);

  const playlistHTML = useMemo(() => {
    return playlists.map((e) => {
      const addToPL = async () => {
        playlistAddSong(e.id, songId);
        dispatch(
          addSongToPlaylistAction({
            playlistId: e.id,
            songId,
          })
        );
      };

      const removeFromPL = async () => {
        playlistRemoveSong(e.id, songId);
        dispatch(
          removeSongFromPlaylistAction({
            playlistId: e.id,
            songId,
          })
        );
      };

      return (
        <div key={e.id} className={s.playlist}>
          <A path={patches.PLAYLIST + e.id}>{e.name}</A>
          {e.songs.includes(songId) ? (
            <FiTrash2 onClick={removeFromPL} />
          ) : (
            <IoAddSharp onClick={addToPL} />
          )}
        </div>
      );
    });
  }, [
    playlists,
    addSongToPlaylistAction,
    dispatch,
    removeSongFromPlaylistAction,
    songId,
  ]);

  return (
    <Modal state={state} closeAction={closeAction}>
      <h2>Edit playlist</h2>
      <div style={{ marginTop: "1rem" }}>{playlistHTML}</div>
    </Modal>
  );
}

export default ModalAddSongPL;
