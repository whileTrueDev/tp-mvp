import React from 'react';

export type ImageUploadObject = {imageName: string; imageSrc: string | ArrayBuffer | null};
export interface UseImageUploadObject {
    defaultImageObject: {
        imageName: string;
        imageSrc: string;
    };
    image: ImageUploadObject;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetImage: (imageString?: string) => void;
}
export default function useImageUpload(defaultImage?: string): UseImageUploadObject {
  const defaultImageObject = {
    imageName: defaultImage || '',
    imageSrc: defaultImage || '',
  };
  const [image, setImage] = React.useState<ImageUploadObject>(defaultImageObject);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(defaultImageObject);
    if (e.target.files) {
      const fileName = e.target.files[0].name;
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage({
            imageName: fileName,
            imageSrc: reader.result,
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSetImage = (imageString?: string) => {
    setImage({
      imageName: imageString || '',
      imageSrc: imageString || '',
    });
  };

  return {
    defaultImageObject,
    image,
    handleImageUpload,
    handleSetImage,
  };
}
