import React, { useContext, useEffect, useState } from "react";
import { UserContext, ImageGallery } from "context/Context";
import { ref, onValue, query, limitToFirst, orderByKey } from "firebase/database";
import { database } from "../../../Firebase";
import "react-toastify/dist/ReactToastify.css";
import "./AddLink.scss";
import GalleryImage from "./components/GalleryImage";
import LoadMoreButton from "./components/LoadMoreButton";
import LinkInput from "./components/LinkInput";

const AddLink = () => {
    const { user } = useContext(UserContext);
    const { links, setLinks } = useContext(ImageGallery);
    const [loadedImages, setLoadedImages] = useState(10); // Default number of images to load
    const [isLoading, setIsLoading] = useState(false); // Loading state // Load images function

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
    }; // Load images

    useEffect(() => {
        if (user) {
            loadImages();
        }
    }, [user, loadedImages]); // Load more images

    const loadMoreImages = () => {
        setIsLoading(true);
        setLoadedImages((prev) => prev + 10); // Adding 10 more images
        setIsLoading(false);
    };

    return (
        <div className="add-link-wrapper">
            <LinkInput />
            <div className="gallery-image-wrapper">
                {links.map((url) => (
                    <GalleryImage
                        key={url.id}
                        url={url}
                    />
                ))}
            </div>
            <div className="add-more-btn-wrapper">
                {links.length >= loadedImages && (
                    <LoadMoreButton
                        isLoading={isLoading}
                        onClick={loadMoreImages}
                    />
                )}
            </div>
        </div>
    );
};

export default AddLink;
