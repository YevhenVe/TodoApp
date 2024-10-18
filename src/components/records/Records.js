import React, { useState, useEffect, useContext } from "react";
import { database } from "../../Firebase";
import { ref, onValue, push, remove, update } from "firebase/database";
import { ReactComponent as RemoveTextIcon } from "../../assets/removeTextIcon.svg";
import { ReactComponent as DoneIcon } from "../../assets/done.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { UserContext, OptionContext } from "context/Context";
import { ThemeColorContext } from "context/Context";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import CustomButton from "../customButton/CustomButton";
import "react-toastify/dist/ReactToastify.css";
import RemoveConfirmation from "../removeConfirmation/RemoveConfirmation";
import RecordsOptions from "./recordsOptions/RecordsOptions";
import "./Records.scss";

const Records = () => {
    const { user } = useContext(UserContext);
    const { theme } = useContext(ThemeColorContext);
    const { input, setInput, selectedOption, setSelectedOption } = useContext(OptionContext);
    const [records, setRecords] = useState([]);
    const [checkedRecord, setCheckedRecord] = useState(null);
    const [removeRecordConfirmation, setRemoveRecordConfirmation] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [isSorted, setIsSorted] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [notificationDate, setNotificationDate] = useState("");
    const [notificationTime, setNotificationTime] = useState("");
    const [open, setOpen] = useState(false);
    const startEditing = (recordId, currentContent) => {
        setEditingRecordId(recordId);
        setEditedContent(currentContent);
    };

    //Auto focus on input if click edit
    useEffect(() => {
        const inputElement = document.querySelector(".edit-input");
        if (inputElement && editingRecordId !== null) {
            inputElement.focus();
        }
    }, [editingRecordId]);

    const submitEdit = (recordId) => {
        if (user && editedContent.trim() !== "") {
            const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
            update(recordRef, {
                content: editedContent,
            });
            setEditingRecordId(null);
            setEditedContent("");
        }
    };

    useEffect(() => {
        if (user) {
            // Subscribing to user records
            const userRecordsRef = ref(database, "records/" + user.uid);
            onValue(userRecordsRef, (snapshot) => {
                const recordsData = snapshot.val();
                const recordsList = recordsData
                    ? Object.keys(recordsData)
                          .map((key) => ({
                              id: key,
                              ...recordsData[key],
                          }))
                          .sort((a, b) => {
                              if (a.checked === b.checked) {
                                  return b.timestamp - a.timestamp; // Sort by timestamp if both checked or unchecked
                              }
                              return a.checked ? 1 : -1; // Move checked records to the bottom
                          })
                    : [];
                setRecords(recordsList);
            });
        } else {
            setRecords([]);
        }
    }, []);

    // Adding a record
    const addRecord = () => {
        if (user) {
            const userRecordsRef = ref(database, "records/" + user.uid);
            const notificationTimestamp = new Date(`${notificationDate}T${notificationTime}`).getTime(); // Преобразуем дату и время в timestamp
            push(userRecordsRef, {
                content: input,
                timestamp: Date.now(),
                checked: false,
                notificationTime: notificationTimestamp, // Сохраняем время уведомления
            });
            setInput("");
            setNotificationDate("");
            setNotificationTime("");
        } else {
            console.log("Sign in with Google to add the record");
        }
    };

    // Handle checking/unchecking a record
    const handleCheckRecord = (recordId, isChecked) => {
        if (user) {
            const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
            update(recordRef, {
                checked: isChecked,
            });
            setCheckedRecord(isChecked ? recordId : null);
        }
    };

    // Deleting a record
    const deleteRecord = (recordId) => {
        if (user) {
            const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
            remove(recordRef);
        } else {
            console.log("Please login");
        }
    };

    //Set Record by clicking "Enter" button
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (input && notificationDate && notificationTime) {
                addRecord();
                setSelectedOption("");
            }
            // Show notification if notificationDate or notificationTime is empty
            else if (!notificationDate || !notificationTime) {
                toast.error("Please set the notification date and time");
            }
            // Check if input is empty
            if (!input) {
                toast.error("Please enter the text of the record");
            }
        }
    };

    // Focus on input when selectedOption changes
    useEffect(() => {
        const inputElement = document.querySelector(".input-records");
        if (inputElement && selectedOption) {
            inputElement.focus();
        }
    }, [selectedOption]);

    const sortedRecords = [...records].sort((a, b) => (isSorted ? new Date(b.timestamp) - new Date(a.timestamp) : a.checked ? 1 : -1));

    // Filter records by search input
    const filterRecordsBySearchInput = (records) => {
        return records.filter((record) => record.content.toLowerCase().includes(searchInput.toLowerCase()));
    };
    const filteredRecords = filterRecordsBySearchInput(sortedRecords);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now(); // Current time
            records.forEach((record) => {
                if (record.notificationTime && record.notificationTime <= now && !record.notified) {
                    showNotification(record.content); // Show notification
                    markAsNotified(record.id); // Check as notified
                }
            });
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [records]);

    // Function to show notification
    const showNotification = (message) => {
        if (Notification.permission === "granted") {
            new Notification("Reminder", {
                body: message,
            });
        }
    };

    // Set record as notified
    const markAsNotified = (recordId) => {
        const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
        update(recordRef, { notified: true });
    };

    // Request permission for notifications
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Open/close date picker
    const handleClick = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="records-wrapper">
            <ToastContainer
                autoClose={4000}
                position="top-center"
                theme={theme ? "light" : "dark"}
                closeOnClick
                pauseOnHover
                draggable
            />
            <input
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
            />
            <div className="options">
                <RecordsOptions />
            </div>
            <div className="input-box">
                <input
                    className="input-records"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your text here"
                />
                <div className="input-buttons-box">
                    <div className="data-and-time-picker">
                        <Tooltip
                            open={open}
                            onClose={handleClose}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            placement="top"
                            arrow
                            title={
                                <div className="datapicker">
                                    <input
                                        type="date"
                                        className="input-date"
                                        value={notificationDate}
                                        onChange={(e) => setNotificationDate(e.target.value)}
                                    />

                                    <input
                                        type="time"
                                        className="input-time"
                                        value={notificationTime}
                                        onChange={(e) => setNotificationTime(e.target.value)}
                                    />
                                </div>
                            }
                        ></Tooltip>
                        <CustomButton
                            label="📅"
                            onClick={handleClick}
                            className="set-item"
                        />
                    </div>
                    <CustomButton
                        className={`set-item ${!input || !notificationDate || !notificationTime ? "" : ""}`}
                        label=">"
                        onClick={() => {
                            if (input && notificationDate && notificationTime) {
                                addRecord();
                                setSelectedOption("");
                            } else {
                                // Show notification if notificationDate or notificationTime is empty
                                if (!notificationDate || !notificationTime) {
                                    toast.error("Please set the notification date and time");
                                }
                                // Check if input is empty
                                if (!input) {
                                    toast.error("Please enter the text of the record");
                                }
                            }
                        }}
                    />
                </div>
                {records.length > 1 && (
                    <p
                        className="sort-button"
                        onClick={() => setIsSorted(!isSorted)}
                    >
                        Sort by date{isSorted ? " ▼" : " ▲"}
                    </p>
                )}
            </div>
            <div className="records">
                {filteredRecords.map((record) => (
                    <div
                        key={record.id}
                        className={`record ${record.checked ? "record-done" : ""}`}
                    >
                        {editingRecordId === record.id ? (
                            <input
                                className="edit-input"
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") submitEdit(record.id);
                                }}
                            />
                        ) : (
                            <div className="record-text">
                                <p className="record-timestamp">Note created: {new Date(record.timestamp).toLocaleString()}</p>
                                <p className="record-content">{record.content}</p>
                                <p className="record-timestamp">Alarm: {record.notificationTime && <span>{new Date(record.notificationTime).toLocaleString()}</span>}</p>
                            </div>
                        )}
                        <div className={`button-box ${removeRecordConfirmation ? "disabled" : ""}`}>
                            <CustomButton
                                className="check-record-text"
                                onClick={() => handleCheckRecord(record.id, !record.checked)}
                                icon={editingRecordId === record.id ? <></> : <DoneIcon />}
                            />
                            {!record.checked && (
                                <CustomButton
                                    className="edit-record-text"
                                    onClick={editingRecordId === record.id ? () => submitEdit(record.id) : () => startEditing(record.id, record.content)}
                                    icon={editingRecordId === record.id ? <DoneIcon /> : <EditIcon />}
                                />
                            )}
                            <CustomButton
                                className="remove-record-text"
                                onClick={() => {
                                    setSelectedRecordId(record.id);
                                    setRemoveRecordConfirmation(true);
                                }}
                                icon={<RemoveTextIcon />}
                            />
                        </div>
                    </div>
                ))}
                {removeRecordConfirmation && (
                    <RemoveConfirmation>
                        <CustomButton
                            className="remove-yes"
                            onClick={() => {
                                if (selectedRecordId) {
                                    deleteRecord(selectedRecordId);
                                    setRemoveRecordConfirmation(false);
                                }
                            }}
                            label="YES"
                        />
                        <CustomButton
                            className="remove-no"
                            onClick={() => setRemoveRecordConfirmation(false)}
                            label="NO"
                        />
                    </RemoveConfirmation>
                )}
            </div>
        </div>
    );
};

export default Records;
