import Router from "next/router";
import React, { useState } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import addLikeOnPlayList from "../../utils/firebase/playlist/addLikeOnPlayList";
import createPlaylistFB from "../../utils/firebase/playlist/createPlaylistFB";
import { patches } from "../../utils/patches";
import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";

type ModalCreatePlaylistI = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

function ModalCreatePlaylist({ setState, state }: ModalCreatePlaylistI) {
  const [name, setName] = useState("");
  const { username, uid } = useTypedSelector((store) => store.user);

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const createPlaylist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (name.length > 0) {
      const pathid = await createPlaylistFB(name, username, uid);
      await addLikeOnPlayList(uid, pathid);
      Router.push(patches.PLAYLIST + pathid);
    }
  };

  return (
    <Modal state={state} closeAction={() => setState(false)}>
      <Input
        text="Playlist name"
        type="text"
        value={name}
        onChange={nameHandler}
      />

      <Button
        text="Create playlist"
        onClick={createPlaylist}
        style={{ marginLeft: "1rem" }}
      />
    </Modal>
  );
}

export default ModalCreatePlaylist;
