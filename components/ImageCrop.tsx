import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { croppedAreaPixelsI } from "../pages/profile/[uid]";
import getCroppedImg from "../utils/cropImage";
import Button from "./Button";

type ImageCropI = {
  image: string;
  setImage: (url: string) => void;
};

function ImageCrop({ image, setImage }: ImageCropI) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedImage, setCroppedImage] = useState(image);

  const onCropComplete = useCallback(
    async (
      croppedArea: croppedAreaPixelsI,
      croppedAreaPixels: croppedAreaPixelsI
    ) => {
      const imageCr: any = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(imageCr);
    },
    [image]
  );

  const saveAction = (e: React.MouseEvent) => {
    e.preventDefault();
    setImage(croppedImage);
  };

  return (
    <div className="avatar-crop">
      <Cropper
        crop={crop}
        onCropChange={setCrop}
        aspect={1 / 1}
        zoom={zoom}
        image={image}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
      <Button
        text="Save"
        style={{ margin: "1rem", width: "calc(100% - 2rem)" }}
        onClick={saveAction}
      />
    </div>
  );
}

export default ImageCrop;
