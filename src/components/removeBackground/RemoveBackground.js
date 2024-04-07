import React, { useContext, useState } from "react";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref, remove } from "firebase/database";
import { ReactComponent as RemoveImageIcon } from "../../assets/removeImageIcon.svg";
import { database, storage } from "../../Firebase";
import { UserContext, BackgroundContext } from "context/Context";
import RemoveConfirmation from "../removeConfirmation/RemoveConfirmation";
import CustomButton from "../customButton/CustomButton";
import "./RemoveBackground.scss";

const RemoveBackground = () => {
    const [removeImageConfirmation, setRemoveImageConfirmation] = useState(false);
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
                    onClick={() => setRemoveImageConfirmation(!removeImageConfirmation)}
                    label="Delete Background"
                    icon={<RemoveImageIcon />}
                    key={image.id}
                />
            ))}
            {removeImageConfirmation && (
                <RemoveConfirmation>
                    {images.map((image) => (
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

export default RemoveBackground;
