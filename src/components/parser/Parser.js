import React, { useEffect, useState } from "react";

const Parser = () => {
    const [parsedData, setParsedData] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const targetUrl = "https://unsplash.com/";
                const proxyUrl = "https://cors-anywhere.herokuapp.com/";
                const response = await fetch(proxyUrl + targetUrl);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const targetDiv = doc.querySelector("div.NHQ0m");

                if (targetDiv) {
                    setParsedData(targetDiv.innerHTML);
                } else {
                    console.error("Целевой div не найден");
                }
            } catch (error) {
                console.error("Ошибка при парсинге:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Спарсенные данные</h2>
            <div dangerouslySetInnerHTML={{ __html: parsedData }} />
        </div>
    );
};

export default Parser;
