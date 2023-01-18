import s from "../styles/pages/Home.module.scss";
import MainConteiner from "../components/MainConteiner";
import getSongArray from "../utils/firebase/songs/getSongArray";
import { useEffect, useState } from "react";
import SongItem from "../components/SongItem";
import Loader from "../components/Loader";
import { MusicI } from "../types/MusicI";

type HomeI = {
  songs: MusicI[];
  selectedSong: MusicI;
};

export default function Home({ selectedSong, songs: songsProps }: HomeI) {
  const [songs, setSongs] = useState<MusicI[]>(songsProps);
  const { fileURL, author, id, imageURL, songName, duration, authorID } =
    selectedSong;

  useEffect(() => {
    setSongs(songsProps.slice(0, 20));
  }, [songsProps]);

  if (imageURL.length < 1) {
    return (
      <MainConteiner title="Musio.io">
        <Loader />
      </MainConteiner>
    );
  }

  return (
    <MainConteiner title="Musio.io">
      <div className={s.container}>
        <div>
          <h1>Listen music on Musio.io</h1>
          <p>
            Make your own music favourite list, discover new sounds to your ears
            and enjoy our simple service!
          </p>
        </div>

        <SongItem
          author={author}
          image={imageURL}
          name={songName}
          id={id}
          duration={duration}
          fileURL={fileURL}
          listToPlay="GLOBALSTORE"
          authorID={authorID}
        />
      </div>
      <div className={s.songs}>
        {songs.map((e) => {
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
        })}
      </div>
    </MainConteiner>
  );
}

export async function getServerSideProps() {
  return {
    props: await getSongArray().catch((e) => {
      return { notFound: true };
    }),
  };
}
