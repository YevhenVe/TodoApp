import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { ref, remove, push, get } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { UserContext } from "context/Context";
import { database, storage } from "../../../../Firebase";

const GalleryImage = ({ url }) => {
    const { user } = useContext(UserContext); // Delete image

    const deleteImage = async (imageId, imageUrl) => {
        await remove(ref(database, `images/${user.uid}/${imageId}`));
        try {
            await deleteObject(storageRef(storage, imageUrl));
            console.success("Image deleted successfully!");
        } catch (error) {
            console.error("Error deleting image from storage.");
        }
    }; // Save image to database

    const saveImageToDatabase = async (imageUrl) => {
        if (user) {
            const userImagesRef = ref(database, "images/" + user.uid);
            const imagesSnapshot = await get(userImagesRef);
            const imagesData = imagesSnapshot.val();
            if (imagesData) {
                const imagesList = Object.keys(imagesData).map((key) => ({
                    id: key,
                    ...imagesData[key],
                }));

                if (imagesList.length > 0) {
                    const lastImage = imagesList[imagesList.length - 1];
                    await deleteImage(lastImage.id, lastImage.url);
                }
            }
            push(userImagesRef, {
                url: imageUrl,
            })
                .then(() => {
                    toast.success("Image applied successfully!");
                })
                .catch(() => {
                    console.error("Failed to save image.");
                });
        } else {
            toast.error("No user found.");
        }
    }; // Delete link

    const deleteLink = async (linkId) => {
        if (user) {
            try {
                const linkRef = ref(database, `links/${user.uid}/${linkId}`);
                await remove(linkRef);
                toast.success("Image deleted successfully!");
            } catch (error) {
                toast.error("Error deleting link.");
            }
        } else {
            toast.error("No user found.");
        }
    };

    return (
        <div className="gallery-image-link">
            <Tooltip
                componentsProps={{
                    tooltip: {
                        sx: {
                            bgcolor: "var(--ios-dark-color)",
                            "& .MuiTooltip-arrow": {
                                color: "var(--ios-dark-color)",
                            },
                            borderRadius: "10px",
                            boxShadow: "0px 0px 50px 0px rgba(0, 0, 0, 0.75)",
                        },
                    },
                }}
                title={
                    <div
                        className="remove-link"
                        onClick={() => deleteLink(url.id)}
                        title="Remove image"
                    >
                        🗑️
                    </div>
                }
                placement="top"
                arrow
            >
                <img
                    className="gallery-image"
                    src={url.link}
                    alt="gallery media"
                    onClick={() => {
                        deleteImage(url.id, url.link);
                        saveImageToDatabase(url.link);
                    }}
                />
            </Tooltip>
        </div>
    );
};

export default GalleryImage;
