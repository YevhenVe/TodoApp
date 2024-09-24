import React, { useContext, useEffect, useState } from "react";
import { ref, push, remove, onValue, get, query, limitToFirst, orderByKey } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../../../Firebase";
import { Tooltip } from "@mui/material";
import { UserContext, ImageGallery } from "context/Context";
import CustomButton from "components/customButton/CustomButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddLink.scss";

const AddLink = () => {
    const { user } = useContext(UserContext);
    const { inputLink, setInputLink, links, setLinks } = useContext(ImageGallery);
    const [loadedImages, setLoadedImages] = useState(10); // Default number of images to load
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Load images
    useEffect(() => {
        if (user) {
            loadImages();
        }
    }, [user, loadedImages]);

    // Load images
    const loadImages = () => {
        if (user) {
            const userLinksRef = query(ref(database, "links/" + user.uid), orderByKey(), limitToFirst(loadedImages));
            onValue(userLinksRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const linksArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        link: value.link,
                    }));
                    setLinks(linksArray);
                } else {
                    setLinks([]);
                }
            });
        }
    };
    // Add link
    const addLink = () => {
        if (user) {
            const userLinksRef = ref(database, "links/" + user.uid);
            push(userLinksRef, {
                link: inputLink,
            })
                .then(() => {
                    toast.success("Image added successfully!");
                    setInputLink("");
                })
                .catch(() => {
                    console.error("Failed to add the link.");
                });
        } else {
            toast.error("No user found.");
        }
    };

    // Save image to database
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
    };

    //  Delete image
    const deleteImage = async (imageId, imageUrl) => {
        await remove(ref(database, `images/${user.uid}/${imageId}`));
        try {
            await deleteObject(storageRef(storage, imageUrl));
            console.success("Image deleted successfully!");
        } catch (error) {
            console.error("Error deleting image from storage.");
        }
    };

    // Delete link
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

    // Load more images
    const loadMoreImages = () => {
        setIsLoading(true);
        setLoadedImages((prev) => prev + 10); // Adding 10 more images
        setIsLoading(false);
    };

    return (
        <div className="add-link-wrapper">
            <div className="top-section-box">
                <input
                    className="input-links"
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    placeholder="Type your text here"
                />
                <CustomButton
                    className={`set-item ${!inputLink ? "disabled" : ""}`}
                    label="Add"
                    onClick={() => {
                        if (inputLink) {
                            addLink();
                        }
                    }}
                />
            </div>
            <div className="gallery-image-wrapper">
                {links.map((url) => (
                    <div
                        key={url.id}
                        className="gallery-image-link"
                    >
                        <Tooltip
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: "var(--ios-dark-color)",
                                        "& .MuiTooltip-arrow": {
                                            color: "var(--ios-dark-color)",
                                        },
                                        borderRadius: "30px",
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
                ))}
            </div>
            <div className="add-more-btn-wrapper">
                {links.length >= loadedImages && (
                    <CustomButton
                        className="load-more-btn"
                        label={isLoading ? "Loading..." : "Load More"}
                        onClick={loadMoreImages}
                    />
                )}
            </div>
        </div>
    );
};

export default AddLink;
