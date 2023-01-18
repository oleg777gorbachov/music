import React, { useEffect, useMemo } from "react";
import MainConteiner from "../components/MainConteiner";
import SongItem from "../components/SongItem";
import { MusicI } from "../types/MusicI";
import getSongArray from "../utils/firebase/songs/getSongArray";
import s from "../styles/pages/Home.module.scss";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useTypedDispatch } from "../hooks/useTypedDispatch";
import { songsStoreReducer } from "../redux/reducers/songStoreReducer";

type MarketI = {
  songs: MusicI[];
};

function Market({ songs: songsInitial }: MarketI) {
  const dispatch = useTypedDispatch();
  const { StoreSongs } = useTypedSelector((store) => store.songStore);
  const { setStoreSongsAction } = songsStoreReducer.actions;

  const itemsList = useMemo(
    () =>
      StoreSongs.map((e) => {
        return (
          <SongItem
            key={e.id}
            author={e.author}
            image={e.imageURL}
            name={e.songName}
            id={e.id}
            duration={e.duration}
            fileURL={e.fileURL}
            listToPlay="GLOBALSTORE"
            authorID={e.authorID}
          />
        );
      }),
    [StoreSongs]
  );

  useEffect(() => {
    dispatch(setStoreSongsAction(songsInitial));
  }, [songsInitial]);

  return (
    <MainConteiner
      title="Musio.io MarketPlace"
      image={songsInitial[0].imageURL}
    >
      <h2 className={s.title}>MarketPlace</h2>
      <div className={s.songs}>{itemsList}</div>
    </MainConteiner>
  );
}

export default Market;

export async function getServerSideProps() {
  return {
    props: await getSongArray().catch(() => {
      return { notFound: true };
    }),
  };
}
