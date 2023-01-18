import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import Image from "next/image";
import Card from "./Card";
import s from "../styles/pages/profile.module.scss";
import ImageCrop from "./ImageCrop";
import Input from "./Input";
import Modal from "./Modal";
import Router from "next/router";
import writeSong from "../utils/firebase/songs/writeSong";
import { patches } from "../utils/patches";
import createCroppedFile from "../utils/createCroppedFile";
import { useTypedSelector } from "../hooks/useTypedSelector";
import NotificationBox from "./NotificationBox";

function SongWrapper() {
  const [number, setNumber] = useState(1);

  const audioRef = useRef() as RefObject<HTMLAudioElement>;

  const [audioLength, setAudioLength] = useState(0);
  const [isError, setIsError] = useState(false);

  const [fileSongAudio, setFileSongAudio] = useState<Blob>();
  const [fileSong, setFileSong] = useState<Blob>();
  const [isCropSong, setIsCropSong] = useState(false);
  const [songPreview, setSongPreview] = useState("/preview.png");

  const [songName, setSongName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { username, uid } = useTypedSelector((store) => store.user);

  const loadHanderSongAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFileSongAudio(file);
    }
  };

  const saveActionCropSong = (url: string) => {
    setSongPreview(url);
    setIsCropSong(false);
  };

  const loadHanderSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const fileLink = URL.createObjectURL(file);
      setFileSong(file);
      setSongPreview(fileLink);
      setIsCropSong(true);
    }
  };

  const songNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSongName(e.target.value);
  };

  const back = () => {
    if (number > 1) {
      setNumber((prev) => prev - 1);
    }
  };

  const next = () => {
    if (number < 3) {
      setNumber((prev) => prev + 1);
      setIsError(false);
    }
  };

  const uploadSong = () => {
    setIsSuccess(true);
    writeSongToFirebase();
  };

  const writeSongToFirebase = async () => {
    if (fileSongAudio && fileSong) {
      setTimeout(() => {
        setIsError(true);
        setTimeout(() => setIsSuccess(false), 2000);
      }, 5000);
      const imageSong = await createCroppedFile(songPreview);
      await writeSong(
        fileSongAudio,
        imageSong,
        songName,
        username,
        uid,
        audioLength
      ).then((e) => Router.push(patches.SONG + e));
    }
  };

  useEffect(() => {
    if (fileSongAudio && audioRef.current) {
      const url = URL.createObjectURL(fileSongAudio);
      audioRef.current.src = url;
    }
  });

  const handleLoadMetadata = (meta: any) => {
    const { duration } = meta.target;
    if (duration < 30 || duration > 3600) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setAudioLength(Math.round(duration));
  };

  const FirstElement = (
    <div>
      <label className={`${s.select} ${s.select_song}`}>
        <span>{fileSongAudio ? fileSongAudio.name : "Song file"}</span>
        <input type="file" accept="audio/*" onChange={loadHanderSongAudio} />
        {fileSongAudio ? (
          <audio ref={audioRef} onLoadedMetadata={handleLoadMetadata} />
        ) : (
          ""
        )}
      </label>
      <NotificationBox
        state={isError}
        text="Minimum length of file is 30s, and maximum is 1 hour"
        type="ALERT"
      />
    </div>
  );

  const SecondElement = (
    <Input
      text="Your song name"
      type="text"
      value={songName}
      onChange={songNameHandler}
    />
  );

  const ThirdElement = (
    <>
      <label className={s.select}>
        <span>Select your avatar</span>
        <input type="file" accept="image/*" onChange={loadHanderSong} />
        <Image
          src={songPreview}
          alt="Preview"
          width={200}
          height={200}
          style={{ borderRadius: "6px" }}
        />
      </label>
      {isCropSong && (
        <ImageCrop image={songPreview} setImage={saveActionCropSong} />
      )}
    </>
  );

  const isFileUpload = useMemo(
    () => (fileSongAudio ? true : false),
    [fileSongAudio]
  );

  const isPreviewUpload = useMemo(() => (fileSong ? true : false), [fileSong]);

  return (
    <div>
      <h2 className={s.title}>
        {number <= 1
          ? "Give chance to your track, upload it on our service"
          : number === 2
          ? "Please enter song name!"
          : "You almost upload your track, just done last step!"}
      </h2>
      <Card className={s.element}>
        {number <= 1
          ? FirstElement
          : number === 2
          ? SecondElement
          : ThirdElement}
      </Card>
      <div className={s.controlls}>
        <Button text="Back" onClick={back} />
        {number <= 1 ? (
          <Button
            text="Next"
            onClick={next}
            isDisabled={!isFileUpload || isError}
          />
        ) : number === 2 ? (
          <Button
            text="Next"
            onClick={next}
            isDisabled={songName.length < 3 ? true : false}
          />
        ) : (
          <Button
            text="Upload song"
            onClick={uploadSong}
            isDisabled={!isPreviewUpload}
          />
        )}
      </div>
      <Modal state={isSuccess} closeAction={() => {}}>
        Please wait...
        <NotificationBox
          state={isError}
          text={"Something went wrong"}
          type="DANGER"
        />
      </Modal>
    </div>
  );
}

export default SongWrapper;
