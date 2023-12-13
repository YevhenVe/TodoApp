import React, { useContext } from "react";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref, remove } from "firebase/database";
import UserContext from "../../context/UserContext";
import { database, storage } from "../../Firebase";
import { ReactComponent as RemoveImageIcon } from "../../assets/removeImageIcon.svg";
import BackgroundContext from "../../context/BackgroundContext";
import CustomButton from "../customButton/CustomButton";

const RemoveBg = () => {
    const { images } = useContext(BackgroundContext);
    const { user } = useContext(UserContext);

    const deleteImage = async (imageId, imageUrl) => {
        // Delete reference from database
        await remove(ref(database, `images/${user.uid}/${imageId}`));
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
            {images.map((image) => (
                <CustomButton
                    key={image.id}
                    onClick={() => deleteImage(image.id, image.url)}
                    label="Delete Background"
                    icon={<RemoveImageIcon />}
                />
            ))}
        </>
    );
};

export default RemoveBg;
