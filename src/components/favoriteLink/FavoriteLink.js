import React, { useState, useEffect, useContext } from "react";
import CustomButton from "components/customButton/CustomButton";
import { database } from "Firebase";
import { UserContext } from "context/Context";
import { Tooltip } from "@mui/material";
import { ref, set, push, onValue, remove } from "firebase/database";
import "./FavoriteLink.scss";

const FavoriteLink = () => {
    const { user } = useContext(UserContext);
    const [openInput, setOpenInput] = useState(false);
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState("");
    const [error, setError] = useState(null);

    // Effect hook to fetch links when user changes
    useEffect(() => {
        if (user && user.uid) {
            fetchLinks(user.uid);
        } else {
            setLinks([]);
        }
    }, [user]);

    // Effect hook to clear error message when new link is added
    useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [newLink]);

    // Fetch user's links from Firebase Realtime Database
    const fetchLinks = (uid) => {
        const linksRef = ref(database, `websitelinks/${uid}`);
        onValue(
            linksRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const fetchedLinks = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value,
                    }));
                    setLinks(fetchedLinks);
                } else {
                    setLinks([]);
                    console.log("No links found for user:", uid);
                }
            },
            (error) => {
                console.error("Error fetching links:", error);
                setError("Error fetching links:");
            }
        );
    };

    // Handler for adding a new link
    const handleAddLink = (event) => {
        event.preventDefault();
        setError(null);
        try {
            const url = new URL(newLink);
            const hostname = url.hostname;
            const name = hostname.replace(/^www\./, "").split(".")[0];
            const link = {
                url: newLink,
                name: name.charAt(0).toUpperCase() + name.slice(1),
                icon: `https://www.google.com/s2/favicons?domain=${newLink}`,
            };

            if (user && user.uid) {
                const linksRef = ref(database, `websitelinks/${user.uid}`);
                const newLinkRef = push(linksRef);
                set(newLinkRef, link)
                    .then(() => {
                        setNewLink("");
                        setOpenInput(false);
                    })
                    .catch((error) => {
                        console.error("Error adding link:", error);
                        setError("Error adding link");
                    });
            }
        } catch (error) {
            console.error("Error processing link:", error);
            setError("Error processing link");
        }
    };

    // Handler for removing a link
    const handleRemoveLink = (linkId) => {
        if (user && user.uid) {
            const linkRef = ref(database, `websitelinks/${user.uid}/${linkId}`);
            remove(linkRef)
                .then(() => {
                    console.log("Link removed successfully");
                })
                .catch((error) => {
                    console.error("Error removing link:", error);
                    setError("Error removing link:");
                });
        }
    };

    return (
        <div className="favorite-link-wrapper">
            {openInput && (
                <>
                    <form
                        onSubmit={handleAddLink}
                        className="link-input-wrapper"
                    >
                        <input
                            type="text"
                            value={newLink}
                            onChange={(event) => setNewLink(event.target.value)}
                            placeholder="Enter link URL"
                            className="link-input"
                        />
                        <CustomButton
                            className={`add-link-button ${!newLink && "disabled"}`}
                            type="submit"
                            label="Add"
                            disabled={!newLink}
                        />
                    </form>
                    {error && <div className="error">{error}</div>}
                </>
            )}

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
                        key={link.id}
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
                        <div className="link-item">
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
