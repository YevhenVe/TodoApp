import React, { useState, useEffect, useContext, useRef } from "react";
import CustomButton from "components/customButton/CustomButton";
import { toast } from "react-toastify";
import SortableItem from "./SortableItem";
import { database } from "Firebase";
import { UserContext } from "context/Context";
import { ref, set, push, onValue, remove, update } from "firebase/database";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import "./FavoriteLink.scss";

const FavoriteLink = () => {
    const { user } = useContext(UserContext);
    const [openInput, setOpenInput] = useState(false);
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState("");
    const [error, setError] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (user && user.uid) {
            fetchLinks(user.uid);
        } else {
            setLinks([]);
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [newLink]);

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
                    // Sort by the fie 'order'
                    fetchedLinks.sort((a, b) => a.order - b.order);
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
                order: links.length, // Adding an order property
            };

            if (user && user.uid) {
                const linksRef = ref(database, `websitelinks/${user.uid}`);
                const newLinkRef = push(linksRef);
                set(newLinkRef, link)
                    .then(() => {
                        setNewLink("");
                        setOpenInput(false);
                        toast.success("Link added successfully!");
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

    const handleDragEndEvent = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setLinks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                // Update the order in Firebase
                if (user && user.uid) {
                    const updates = {};
                    newOrder.forEach((item, index) => {
                        updates[`websitelinks/${user.uid}/${item.id}/order`] = index;
                    });
                    update(ref(database), updates); // Sending the updates in Firebase
                }
                return newOrder;
            });
        }
    };
    // This is to prevent the default scroll behavior when using the mouse wheel
    const linksBoxRef = useRef(null);
    const linksBox = linksBoxRef.current;
    linksBox?.addEventListener("wheel", (event) => {
        if (event.deltaY !== 0) {
            event.preventDefault();
            linksBox.scrollBy({
                left: event.deltaY > 0 ? 50 : -50,
            });
        }
    });

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

            <div
                className="links-box"
                ref={linksBoxRef}
            >
                <button
                    className="open-add-link-button"
                    onClick={() => setOpenInput(!openInput)}
                    title="Add link"
                >
                    ⚙️
                </button>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEndEvent}
                >
                    <SortableContext
                        items={links.map((link) => link.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {links.map((link) => (
                            <SortableItem
                                key={link.id}
                                id={link.id}
                                link={link}
                                onRemove={handleRemoveLink}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default FavoriteLink;
