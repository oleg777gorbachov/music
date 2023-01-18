import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { songHistoryReducer } from "../../redux/reducers/songHistoryReducer";
import { MusicI } from "../../types/MusicI";
import readAllSongs from "../../utils/firebase/songs/readAllSongs";
import Modal from "../Modal";
import SongItem from "../SongItem";

type ModalHistorySongsI = {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  songsArray: string[];
  isMyProfile: boolean;
};

function ModalHistorySongs({
  setState,
  state,
  songsArray,
  isMyProfile,
}: ModalHistorySongsI) {
  const [songs, setSongs] = useState<MusicI[]>([]);
  const dispatch = useTypedDispatch();
  const closeAction = () => setState(false);
  const { setSongHistoryAction } = songHistoryReducer.actions;
  const { historySongs } = useTypedSelector((store) => store.songHistory);

  useEffect(() => {
    if (songsArray.length > 0) {
      readAllSongs(songsArray).then((e) => {
        if (isMyProfile) dispatch(setSongHistoryAction(e));
        else setSongs(e);
      });
    }
  }, [dispatch, isMyProfile, setSongHistoryAction, songsArray]);

  const itemsHtml = useMemo(() => {
    if (isMyProfile) {
      return historySongs.map((e) => {
        return (
          <SongItem
            author={e.author}
            name={e.songName}
            image={e.imageURL}
            id={e.id}
            key={e.id}
            type={"STRETCH"}
            duration={e.duration}
            fileURL={e.fileURL}
            listToPlay={"HISTORYSONGS"}
            authorID={e.authorID}
          />
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
          type={"STRETCH"}
          duration={e.duration}
          fileURL={e.fileURL}
          listToPlay={"HISTORYSONGS"}
          authorID={e.authorID}
        />
      );
    });
  }, [songs, isMyProfile, historySongs]);

  const renderState = useMemo(() => {
    if (isMyProfile) {
      if (historySongs.length === 0) return "Nothing there";
      else return itemsHtml;
    } else {
      if (songs.length === 0) return "Nothing there";
      else return itemsHtml;
    }
  }, [songs, isMyProfile, historySongs, itemsHtml]);

  return (
    <Modal
      state={state}
      closeAction={closeAction}
      styles={songs.length > 0 ? { overflowY: "auto" } : {}}
    >
      <h2>Songs history</h2>
      {renderState}
    </Modal>
  );
}

export default ModalHistorySongs;
