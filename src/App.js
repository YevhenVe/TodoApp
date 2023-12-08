import React, { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, push, remove } from "firebase/database";
import { auth, database } from "./Firebase";

const App = () => {
    const [input, setInput] = useState("");
    const [records, setRecords] = useState([]);
    const [user, setUser] = useState(null);

    // Аутентификация через Google
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    // Выход из учетной записи
    const handleSignOut = () => {
        signOut(auth);
    };

    // Слушатель аутентификации пользователя
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                // Подписка на записи пользователя
                const userRecordsRef = ref(database, "records/" + user.uid);
                onValue(userRecordsRef, (snapshot) => {
                    const recordsData = snapshot.val();
                    const recordsList = recordsData
                        ? Object.keys(recordsData).map((key) => ({
                              id: key,
                              ...recordsData[key],
                          }))
                        : [];
                    setRecords(recordsList);
                });
            } else {
                setRecords([]);
            }
        });
    }, []);

    // Добавление записи
    const addRecord = () => {
        if (user) {
            const userRecordsRef = ref(database, "records/" + user.uid);
            push(userRecordsRef, {
                content: input,
                timestamp: Date.now(),
            });
            setInput("");
        } else {
            alert("Пожалуйста, войдите в систему для добавления записей.");
        }
    };

    // Удаление записи
    const deleteRecord = (recordId) => {
        if (user) {
            const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
            remove(recordRef);
        } else {
            alert("Пожалуйста, войдите в систему для удаления записей.");
        }
    };

    return (
        <div>
            {user ? (
                <>
                    <button onClick={handleSignOut}>Выйти</button>
                    <div className="user-wrapper">
                        <h3>{user?.displayName}</h3>
                        <p>{user?.email}</p>
                        <img
                            src={user?.photoURL}
                            alt="avatar"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Введите запись"
                    />
                    <button onClick={addRecord}>Submit</button>
                    <div>
                        {records.map((record) => (
                            <div key={record.id}>
                                {record.content}
                                <button onClick={() => deleteRecord(record.id)}>Удалить</button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <button onClick={signInWithGoogle}>Войти через Google</button>
            )}
        </div>
    );
};

export default App;
