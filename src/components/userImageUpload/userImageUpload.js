import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext, UserImageContext } from "context/Context";
import CustomButton from "../customButton/CustomButton";
import RemoveConfirmation from "../removeConfirmation/RemoveConfirmation";
import { ReactComponent as RemoveUserImageIcon } from "../../assets/removeUserImg.svg";
import { ReactComponent as ImageUploadIcon } from "../../assets/imageUploadIcon.svg";
import { ref, onValue, push, remove } from "firebase/database";
import { database, storage } from "../../Firebase";
import { getDownloadURL, ref as storageRef, uploadBytesResumable, deleteObject } from "firebase/storage";
import "./userImageUpload.scss";

const UserImageUpload = () => {
    const { user } = useContext(UserContext);
    const { userImages, setUserImages, deleteUserImage, uploadedUserImage, setUploadingUserImage, setUserProgress } = useContext(UserImageContext);
    const [image, setImage] = useState(null);
    const [removeImageConfirmation, setRemoveImageConfirmation] = useState(false);
    const [previewUserUrl, setPreviewUserUrl] = useState(null);
    const fileUserInputRef = useRef(null);

    const handleUserFileSelect = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        // Generate preview URL for the selected image
        if (selectedImage) {
            const userImageUrl = URL.createObjectURL(selectedImage);
            setPreviewUserUrl(userImageUrl);
        } else {
            setPreviewUserUrl(null);
        }
    };

    useEffect(() => {
        if (user) {
            const userImagesRef = ref(database, "user_images/" + user.uid);
            onValue(userImagesRef, (snapshot) => {
                const imagesData = snapshot.val();
                const imagesList = imagesData
                    ? Object.keys(imagesData).map((key) => ({
                          id: key,
                          ...imagesData[key],
                      }))
                    : [];
                setUserImages(imagesList);
            });
        } else {
            setUserImages([]);
        }
    }, [user]);

    const uploadImage = async () => {
        if (user && image) {
            if (userImages.length > 0) {
                const lastImage = userImages[userImages.length - 1];
                await deleteUserImage(lastImage.id, lastImage.url);
            }
            const imageRef = storageRef(storage, "user_images/" + user.uid + "/" + image.name);
            const uploadTask = uploadBytesResumable(imageRef, image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
                    setUserProgress(progress);
                    setUploadingUserImage(true);
                },
                (error) => {},
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const userImagesRef = ref(database, "user_images/" + user.uid);
                        push(userImagesRef, {
                            url: downloadURL,
                            timestamp: Date.now(),
                        });
                    });
                    setUploadingUserImage(false);
                    setImage(null); // Cleaning input value after image uploded
                    setPreviewUserUrl(null);
                    if (fileUserInputRef.current) {
                        fileUserInputRef.current.value = "";
                    }
                }
            );
        }
    };

    const deleteImage = async (imageId, imageUrl) => {
        // Delete reference from database
        await remove(ref(database, `user_images/${user?.uid}/${imageId}`));
        // Delete image from storage
        try {
            await deleteObject(storageRef(storage, imageUrl));
            console.log("Image deleted from storage");
        } catch (error) {
            console.error("Error deleting image from storage", error);
        }
    };

    return (
        <>
            <div className="user-image-wrapper">
                {previewUserUrl && (
                    <>
                        <div className="user-image-preview-wrapper">
                            <label
                                htmlFor="file-input"
                                className="choose-image-label"
                            >
                                <img
                                    src={previewUserUrl}
                                    alt="Preview"
                                    className="preview-user-image"
                                />
                            </label>
                        </div>
                        <CustomButton
                            icon={<ImageUploadIcon />}
                            onClick={uploadImage}
                            label="Upload user image"
                            disabled={!image}
                        />
                    </>
                )}
                <div className="user-image-preview-wrapper">
                    {!previewUserUrl && (
                        <>
                            {!uploadedUserImage ? (
                                <img
                                    className="user-image"
                                    src={user?.photoURL}
                                    alt="google user avatar"
                                />
                            ) : (
                                <img
                                    className="user-image"
                                    src={uploadedUserImage}
                                    alt="custom user avatar"
                                />
                            )}
                        </>
                    )}
                </div>
                <div className="choose-user-image-label-wrapper">
                    <label
                        className="choose-user-image-label"
                        htmlFor="user-file-input"
                    />
                </div>
                <input
                    ref={fileUserInputRef}
                    type="file"
                    onChange={handleUserFileSelect}
                    id="user-file-input"
                />
                {uploadedUserImage && (
                    <CustomButton
                        className="remove-custome-user-image"
                        onClick={() => setRemoveImageConfirmation(!removeImageConfirmation)}
                        icon={<RemoveUserImageIcon />}
                        key={image?.id}
                    />
                )}{" "}
            </div>
            {removeImageConfirmation && (
                <RemoveConfirmation>
                    {userImages.map((image) => (
                        <>
                            <CustomButton
                                className="remove-yes"
                                key={image.id}
                                onClick={() => {
                                    deleteImage(image.id, image.url);
                                    setRemoveImageConfirmation(false);
                                }}
                                label="YES"
                            />
                            <CustomButton
                                key={image.id}
                                onClick={() => setRemoveImageConfirmation(false)}
                                label="NO"
                            />
                        </>
                    ))}
                </RemoveConfirmation>
            )}
        </>
    );
};
export default UserImageUpload;
