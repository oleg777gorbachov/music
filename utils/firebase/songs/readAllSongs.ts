import readSong from "./readSong";

export default async (songsArray: string[]) => {
  try {
    const songs: any[] = [];
    for (let key of songsArray) {
      const song = await readSong(key);
      if (song) songs.push(song);
    }
    return songs;
  } catch (error) {
    throw new Error("Error: can't read data");
  }
};
