import React, { useState, useEffect, useContext, useRef } from "react";
import UserContext from "../../context/UserContext";
import BackgroundContext from "../../context/BackgroundContext";
import CustomButton from "../customButton/CustomButton";
import { ReactComponent as ImageUploadIcon } from "../../assets/imageUploadIcon.svg";
import { ReactComponent as ChooseImage } from "../../assets/chooseImage.svg";
import { ref, onValue, push } from "firebase/database";
import { database, storage } from "../../Firebase";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import "./CustomBackground.scss";

const CustomBackground = () => {
    const { user } = useContext(UserContext);
    const { images, setImages, deleteImage, setProgress, setUploading } = useContext(BackgroundContext);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            const userImagesRef = ref(database, "images/" + user.uid);
            onValue(userImagesRef, (snapshot) => {
                const imagesData = snapshot.val();
                const imagesList = imagesData
                    ? Object.keys(imagesData).map((key) => ({
                          id: key,
                          ...imagesData[key],
                      }))
                    : [];
                setImages(imagesList);
            });
        } else {
            setImages([]);
        }
    }, [user]);

    const uploadImage = async () => {
        if (user && image) {
            if (images.length > 0) {
                const lastImage = images[images.length - 1];
                await deleteImage(lastImage.id, lastImage.url);
            }
            const imageRef = storageRef(storage, "images/" + user.uid + "/" + image.name);
            const uploadTask = uploadBytesResumable(imageRef, image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                    setProgress(progress);
                    setUploading(true);
                },
                (error) => {},
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const userImagesRef = ref(database, "images/" + user.uid);
                        push(userImagesRef, {
                            url: downloadURL,
                            timestamp: Date.now(),
                        });
                    });
                    setUploading(false);
                    setImage(null); // Cleaning input value after image uploded
                    setPreviewUrl(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            );
        } else {
            console.log("error");
        }
    };

    const handleFileSelect = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);

        // Generate preview URL for the selected image
        if (selectedImage) {
            const imageUrl = URL.createObjectURL(selectedImage);
            setPreviewUrl(imageUrl);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <div className="background-wrapper">
            <div className="choose-image">
                {previewUrl ? (
                    <label
                        htmlFor="file-input"
                        className="choose-image-label"
                    >
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="preview-image"
                        />
                    </label>
                ) : (
                    <CustomButton
                        icon={<ChooseImage />}
                        label={
                            <label
                                htmlFor="file-input"
                                className="choose-image-label"
                            >
                                Choose image
                            </label>
                        }
                    />
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    id="file-input"
                />
            </div>
            {previewUrl && (
                <CustomButton
                    icon={<ImageUploadIcon />}
                    onClick={uploadImage}
                    label="Upload background"
                    disabled={!image}
                />
            )}
        </div>
    );
};
export default CustomBackground;
