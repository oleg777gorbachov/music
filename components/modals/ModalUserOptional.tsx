import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTypedDispatch } from "../../hooks/useTypedDispatch";
import { userReducer } from "../../redux/reducers/userReducer";
import writeUserAvatar from "../../utils/firebase/user/writeUserAvatar";
import Modal from "../Modal";
import s from "../../styles/pages/profile.module.scss";
import ImageCrop from "../ImageCrop";
import NotificationBox from "../NotificationBox";
import Button from "../Button";
import Input from "../Input";
import createCroppedFile from "../../utils/createCroppedFile";
import changeOptional from "../../utils/firebase/user/changeOptional";
import readUserAvatar from "../../utils/firebase/user/readUserAvatar";
import { userOptionalI } from "../../types/userOptionalI";

type IsErrorType = {
  isLoading: boolean;
  isError: boolean;
  message: string;
};

type ModalUserOptionalI = {
  user: userOptionalI;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

function ModalUserOptional({
  user,
  isEdit,
  name,
  setIsEdit,
  setName,
}: ModalUserOptionalI) {
  const {
    followers,
    following,
    image,
    likelist,
    playlists,
    uid,
    username,
    songHistory,
  } = user;

  const [imagePreview, setImagePreview] = useState(image);
  const [file, setFile] = useState<Blob>();
  const [isCrop, setIsCrop] = useState(false);

  const [state, setState] = useState<IsErrorType>({
    isError: false,
    isLoading: false,
    message: "",
  });

  const dispatch = useTypedDispatch();
  const { setImage, setNickname } = userReducer.actions;

  const modalClose = () => {
    setIsEdit(false);
  };

  const modalOpen = () => {
    setName(username);
    setIsEdit(true);
  };

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const loadHander = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const fileLink = URL.createObjectURL(file);
      setFile(file);
      setImagePreview(fileLink);
      setIsCrop(true);
    }
  };

  const saveAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (name !== username || image !== imagePreview) {
      setState({
        isError: false,
        isLoading: true,
        message: "",
      });
      if (file) {
        const newFile = await createCroppedFile(imagePreview);
        await writeUserAvatar(uid, newFile);
      }
      const url = await readUserAvatar(uid);
      await changeOptional(url, name, uid)
        .then(() => {
          setState({
            isError: false,
            isLoading: false,
            message: "",
          });
          setIsEdit(false);
          dispatch(setNickname(name));
          dispatch(setImage(imagePreview));
        })
        .catch((e) => {
          setState({
            isLoading: false,
            isError: true,
            message: "Something went wrong",
          });
        });
    }
  };

  const saveActionCrop = (url: string) => {
    setImagePreview(url);
    setIsCrop(false);
  };

  useEffect(() => {
    setImagePreview(image);
    setNickname(username);
  }, [isEdit, image, setNickname, username]);

  return (
    <Modal state={isEdit} closeAction={modalClose}>
      <h2>Edit profile</h2>
      <div className={s.modal}>
        <div>
          <Input
            text="Your nickname"
            type="text"
            value={name}
            onChange={nameHandler}
          />
          <NotificationBox
            state={state.isError}
            text={state.message}
            type="DANGER"
          />
          <Button
            text="Save"
            style={{ width: "100%" }}
            onClick={saveAction}
            isDisabled={state.isLoading}
          />
        </div>
        <label className={s.select}>
          <span>Select song preview</span>
          <input type="file" accept="image/*" onChange={loadHander} />
          <Image
            src={imagePreview}
            alt="avatar"
            width={200}
            height={200}
            onClick={modalOpen}
          />
        </label>
        {isCrop && <ImageCrop image={imagePreview} setImage={saveActionCrop} />}
      </div>
    </Modal>
  );
}

export default ModalUserOptional;
