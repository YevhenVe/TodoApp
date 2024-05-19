import React, { useContext, useEffect } from "react";
import { ref, push, remove, onValue, get } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../../../Firebase";
import { UserContext, ImageGallery } from "context/Context";
import CustomButton from "components/customButton/CustomButton";
import "./AddLink.scss";

const AddLink = () => {
    const { user } = useContext(UserContext); // Get the current user from UserContext
    const { inputLink, setInputLink, links, setLinks } = useContext(ImageGallery); // Get and set link-related state from ImageGallery context

    // Load user's links from Firebase database when the user changes
    useEffect(() => {
        if (user) {
            const userLinksRef = ref(database, "links/" + user.uid);
            onValue(userLinksRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const linksArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        link: value.link,
                    }));
                    setLinks(linksArray); // Update state with links array
                } else {
                    setLinks([]); // Set links to an empty array if no data
                }
            });
        }
    }, [user]);

    // Function to add a new link to the database
    const addLink = () => {
        if (user) {
            const userLinksRef = ref(database, "links/" + user.uid);
            push(userLinksRef, {
                link: inputLink,
            });
            setInputLink(""); // Clear the input field after adding the link
        } else {
            console.log("error");
        }
    };

    // Function to save an image URL to the database, deleting the previous one if it exists
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
                    await deleteImage(lastImage.id, lastImage.url); // Delete the last image before adding a new one
                }
            }

            push(userImagesRef, {
                url: imageUrl,
            });
        } else {
            console.log("error");
        }
    };

    // Function to delete an image from the database and storage
    const deleteImage = async (imageId, imageUrl) => {
        // Remove the image reference from the database
        await remove(ref(database, `images/${user.uid}/${imageId}`));
        // Delete the image from Firebase storage
        try {
            await deleteObject(storageRef(storage, imageUrl));
            console.log("Image deleted from storage");
        } catch (error) {
            console.error("Error deleting image from storage", error);
        }
    };

    //Deletes a link from the database.
    const deleteLink = async (linkId) => {
        if (user) {
            try {
                // Remove the link from the database
                const linkRef = ref(database, `links/${user.uid}/${linkId}`);
                await remove(linkRef);
                console.log("Link deleted successfully");
            } catch (error) {
                console.error("Error deleting link", error);
            }
        } else {
            console.log("error");
        }
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
                        } else return;
                    }}
                />
            </div>
            <div className="gallery-image-wrapper">
                {links.map((url) => (
                    <div
                        key={url.id}
                        className="gallery-image-link"
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
                        <div
                            className="remove-link"
                            onClick={() => deleteLink(url.id, url.link)}
                            title="Remove image"
                        >
                            ✖
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddLink;
