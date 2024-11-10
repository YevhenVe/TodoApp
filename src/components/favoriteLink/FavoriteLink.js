import React, { useState, useEffect } from "react";
import { database, auth } from "Firebase";
import { Tooltip } from "@mui/material";
import { ref, set, push, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "./FavoriteLink.scss";
import CustomButton from "components/customButton/CustomButton";

const FavoriteLink = () => {
    const [openInput, setOpenInput] = useState(false);
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState("");
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchLinks(user.uid);
            } else {
                setUserId(null);
                setLinks([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchLinks = (userId) => {
        const linksRef = ref(database, `users/${userId}/Websitelinks`);
        onValue(linksRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const fetchedLinks = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setLinks(fetchedLinks);
            } else {
                setLinks([]);
            }
        });
    };

    const handleAddLink = (event) => {
        event.preventDefault();
        try {
            const url = new URL(newLink);
            const hostname = url.hostname;
            const name = hostname.replace(/^www\./, "").split(".")[0];
            const link = {
                url: newLink,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                icon: `https://www.google.com/s2/favicons?domain=${newLink}`,
            };

            if (userId) {
                const linksRef = ref(database, `users/${userId}/Websitelinks`);
                const newLinkRef = push(linksRef);
                set(newLinkRef, link);
            }

            setNewLink("");
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    useEffect(() => {
        setError(null);
    }, [newLink]);

    const handleRemoveLink = (linkId) => {
        if (userId) {
            const linkRef = ref(database, `users/${userId}/Websitelinks/${linkId}`);
            remove(linkRef);
        }
    };

    return (
        <div className="favorite-link-wrapper">
            {openInput && (
                <form
                    onSubmit={handleAddLink}
                    className="link-input-wrapper"
                >
                    <input
                        type="text"
                        value={newLink}
                        onChange={(event) => setNewLink(event.target.value)}
                        placeholder="Enter a link"
                        className="link-input"
                    />

                    <CustomButton
                        className={`add-link-button ${!newLink && "disabled"}`}
                        type="submit"
                        label="Add"
                        disabled={!newLink}
                    />
                </form>
            )}
            {error && <div className="error">{error}</div>}
            <div className="links-box">
                <button
                    className="open-add-link-button"
                    onClick={() => setOpenInput(!openInput)}
                    title="Add link"
                >
                    ⚙️
                </button>
                {links.map((link) => (
                    <Tooltip
                        placement="top"
                        arrow
                        title={
                            <button
                                className="remove-link-button"
                                onClick={() => handleRemoveLink(link.id)}
                            >
                                🗑️
                            </button>
                        }
                    >
                        <div
                            key={link.id}
                            className="link-item"
                        >
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={link.icon}
                                    alt={link.name}
                                />
                                {link.name}
                            </a>
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

export default FavoriteLink;
